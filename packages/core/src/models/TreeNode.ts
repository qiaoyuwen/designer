import { action, define, observable, toJS } from '@formily/reactive';
import { uid, isFn, each } from '@designer/utils';
import { Operation } from './Operation';
import {
  InsertBeforeEvent,
  InsertAfterEvent,
  InsertChildrenEvent,
  PrependNodeEvent,
  AppendNodeEvent,
  WrapNodeEvent,
  RemoveNodeEvent,
  UpdateNodePropsEvent,
  CloneNodeEvent,
  FromNodeEvent,
  UpdateChildrenEvent,
} from '../events';
import { IDesignerControllerProps, IDesignerProps, IDesignerLocales } from '../types';
import { GlobalRegistry } from '../registry';
import { mergeLocales } from '../internals';

export interface ITreeNode {
  componentName?: string;
  sourceName?: string;
  operation?: Operation;
  hidden?: boolean;
  isSourceNode?: boolean;
  id?: string;
  props?: Record<string | number | symbol, any>;
  children?: ITreeNode[];
  containerClassName?: string;
}

export interface INodeFinder {
  (node: TreeNode): boolean;
}

const TreeNodes = new Map<string, TreeNode>();

const CommonDesignerPropsMap = new Map<string, IDesignerControllerProps>();

const removeNode = (node: TreeNode) => {
  if (node.parent) {
    node.parent.children = node.parent.children.filter((child) => child !== node);
  }
};

const resetNodesParent = (nodes: TreeNode[], parent: TreeNode) => {
  const resetDepth = (node: TreeNode) => {
    node.depth = node.parent ? node.parent.depth + 1 : 0;
    node.children.forEach(resetDepth);
  };

  const shallowReset = (node: TreeNode) => {
    node.parent = parent;
    node.root = parent.root;
    resetDepth(node);
  };

  const deepReset = (node: TreeNode) => {
    shallowReset(node);
    resetNodesParent(node.children, node);
  };

  return nodes.map((node) => {
    if (node === parent) return node;
    if (!parent.isSourceNode) {
      if (node.isSourceNode) {
        node = node.clone(parent);
        resetDepth(node);
      } else if (!node.isRoot && node.isInOperation) {
        node.operation?.selection.remove(node);
        removeNode(node);
        shallowReset(node);
      } else {
        deepReset(node);
      }
    } else {
      deepReset(node);
    }
    if (!TreeNodes.has(node.id)) {
      TreeNodes.set(node.id, node);
      CommonDesignerPropsMap.set(node.componentName, node.designerProps);
    }
    return node;
  });
};

const resetParent = (node: TreeNode, parent: TreeNode) => {
  return resetNodesParent([node], parent)[0];
};

const resolveDesignerProps = (node: TreeNode, props: IDesignerControllerProps) => {
  if (isFn(props)) return props(node);
  return props;
};

export class TreeNode {
  public parent: TreeNode;

  public root: TreeNode;

  public rootOperation: Operation;

  public id: string;

  public depth: number = 0;

  public hidden: boolean = false;

  public componentName: string = 'NO_NAME_COMPONENT';

  public sourceName: string = '';

  public props: ITreeNode['props'] = {};

  public children: TreeNode[] = [];

  public isSelfSourceNode: boolean;

  public containerClassName?: string;

  public constructor(node?: ITreeNode, parent?: TreeNode) {
    if (node instanceof TreeNode) {
      return node;
    }
    this.id = node.id || uid();
    if (parent) {
      this.parent = parent;
      this.depth = parent.depth + 1;
      this.root = parent.root;
      TreeNodes.set(this.id, this);
    } else {
      this.root = this;
      this.rootOperation = node.operation;
      this.isSelfSourceNode = node.isSourceNode || false;
      TreeNodes.set(this.id, this);
    }
    if (node) {
      this.from(node);
    }
    this.makeObservable();
  }

  public makeObservable() {
    define(this, {
      componentName: observable.ref,
      props: observable,
      hidden: observable.ref,
      children: observable.shallow,
      designerProps: observable.computed,
      designerLocales: observable.computed,
      wrap: action,
      prepend: action,
      append: action,
      insertAfter: action,
      insertBefore: action,
      remove: action,
      setProps: action,
      setChildren: action,
      setComponentName: action,
    });
  }

  public get designerProps(): IDesignerProps {
    const behaviors = GlobalRegistry.getDesignerBehaviors(this);
    const designerProps: IDesignerProps = behaviors.reduce((buf, pattern) => {
      if (!pattern.designerProps) return buf;
      Object.assign(buf, resolveDesignerProps(this, pattern.designerProps));
      return buf;
    }, {});
    return designerProps;
  }

  public get designerLocales(): IDesignerLocales {
    const behaviors = GlobalRegistry.getDesignerBehaviors(this);
    const designerLocales: IDesignerLocales = behaviors.reduce((buf, pattern) => {
      if (!pattern.designerLocales) return buf;
      mergeLocales(buf, pattern.designerLocales);
      return buf;
    }, {});
    return designerLocales;
  }

  public get previous() {
    if (this.parent === this || !this.parent) return;
    return this.parent.children[this.index - 1];
  }

  public get next() {
    if (this.parent === this || !this.parent) return;
    return this.parent.children[this.index + 1];
  }

  public get siblings() {
    if (this.parent) {
      return this.parent.children.filter((node) => node !== this);
    }
    return [];
  }

  public get index() {
    if (this.parent === this || !this.parent) return 0;
    return this.parent.children.indexOf(this);
  }

  public get descendants(): TreeNode[] {
    return this.children.reduce((buf, node) => {
      return buf.concat(node).concat(node.descendants);
    }, []);
  }

  public get isRoot() {
    return this === this.root;
  }

  public get isInOperation() {
    return !!this.operation;
  }

  public get lastChild() {
    return this.children[this.children.length - 1];
  }

  public get firstChild() {
    return this.children[0];
  }

  public get isSourceNode() {
    return this.root.isSelfSourceNode;
  }

  public get operation() {
    return this.root?.rootOperation;
  }

  public get viewport() {
    return this.operation?.workspace?.viewport;
  }

  public get outline() {
    return this.operation?.workspace?.outline;
  }

  public get moveLayout() {
    return this.viewport?.getValidNodeLayout(this);
  }

  public getElement(area: 'viewport' | 'outline' = 'viewport') {
    return this[area]?.findElementById(this.id);
  }

  public getValidElement(area: 'viewport' | 'outline' = 'viewport') {
    return this[area]?.getValidNodeElement(this);
  }

  public getElementClientRect(area: 'viewport' | 'outline' = 'viewport') {
    return this[area]?.getElementClientRect(this.getElement(area));
  }

  public getValidElementClientRect(area: 'viewport' | 'outline' = 'viewport') {
    return this[area]?.getValidNodeClientRect(this);
  }

  public getElementOffsetRect(area: 'viewport' | 'outline' = 'viewport') {
    return this[area]?.getElementOffsetRect(this.getElement(area));
  }

  public getValidElementOffsetRect(area: 'viewport' | 'outline' = 'viewport') {
    return this[area]?.getValidNodeOffsetRect(this);
  }

  public getPrevious(step: number = 1) {
    return this.parent.children[this.index - step];
  }

  public getAfter(step: number = 1) {
    return this.parent.children[this.index + step];
  }

  public getSibling(index: number = 0) {
    return this.parent.children[index];
  }

  public getParents(node?: TreeNode): TreeNode[] {
    const _node = node || this;
    return _node?.parent ? [_node.parent].concat(this.getParents(_node.parent)) : [];
  }

  public getParentByDepth(depth: number = 0) {
    const parent = this.parent;
    if (parent?.depth === depth) {
      return parent;
    } else {
      return parent?.getParentByDepth(depth);
    }
  }

  public getMessage(token: string) {
    return GlobalRegistry.getDesignerMessage(token, this.designerLocales);
  }

  public isMyAncestor(node: TreeNode) {
    if (node === this || this.parent === node) return false;
    return node.contains(this);
  }

  public isMyParent(node: TreeNode) {
    return this.parent === node;
  }

  public isMyParents(node: TreeNode) {
    if (node === this) return false;
    return this.isMyParent(node) || this.isMyAncestor(node);
  }

  public isMyChild(node: TreeNode) {
    return node.isMyParent(this);
  }

  public isMyChildren(node: TreeNode) {
    return node.isMyParents(this);
  }

  public takeSnapshot(type?: string) {
    this.operation?.snapshot(type);
  }

  public triggerMutation<T>(event: any, callback?: () => T, defaults?: T): T {
    if (this.operation) {
      const result = this.operation.dispatch(event, callback) || defaults;
      this.takeSnapshot(event?.type);
      return result;
    } else if (isFn(callback)) {
      return callback();
    }
  }

  public find(finder: INodeFinder): TreeNode {
    if (finder(this)) {
      return this;
    } else {
      let result = undefined;
      this.eachChildren((node) => {
        if (finder(node)) {
          result = node;
          return false;
        }
      });
      return result;
    }
  }

  public findAll(finder: INodeFinder): TreeNode[] {
    const results = [];
    if (finder(this)) {
      results.push(this);
    }
    this.eachChildren((node) => {
      if (finder(node)) {
        results.push(node);
      }
    });
    return results;
  }

  public distanceTo(node: TreeNode) {
    if (this.root !== node.root) {
      return Infinity;
    }
    if (this.parent !== node.parent) {
      return Infinity;
    }
    return Math.abs(this.index - node.index);
  }

  public crossSiblings(node: TreeNode): TreeNode[] {
    if (this.parent !== node.parent) return [];
    const minIndex = Math.min(this.index, node.index);
    const maxIndex = Math.max(this.index, node.index);
    const results = [];
    for (let i = minIndex + 1; i < maxIndex; i++) {
      results.push(this.parent.children[i]);
    }
    return results;
  }

  public allowSibling(nodes: TreeNode[]) {
    if (this.designerProps?.allowSiblings?.(this, nodes) === false) return false;
    return this.parent?.allowAppend(nodes);
  }

  public allowDrop(parent: TreeNode) {
    if (!isFn(this.designerProps.allowDrop)) return true;
    return this.designerProps.allowDrop(parent);
  }

  public allowAppend(nodes: TreeNode[]) {
    if (!this.designerProps?.droppable) return false;
    if (this.designerProps?.allowAppend?.(this, nodes) === false) return false;
    if (nodes.some((node) => !node.allowDrop(this))) return false;
    if (this.root === this) return true;
    return true;
  }

  public allowClone() {
    if (this === this.root) return false;
    return this.designerProps.cloneable ?? true;
  }

  public allowHide() {
    if (this === this.root) return false;
    return this.designerProps.hideable ?? true;
  }

  public allowDrag() {
    if (this === this.root && !this.isSourceNode) return false;
    return this.designerProps.draggable ?? true;
  }

  public allowResize(): false | Array<'x' | 'y'> {
    if (this === this.root && !this.isSourceNode) return false;
    const { resizable } = this.designerProps;
    if (!resizable) return false;
    if (resizable.width && resizable.height) return ['x', 'y'];
    if (resizable.width) return ['x'];
    return ['y'];
  }

  public allowRotate() {
    return true;
  }

  public allowRound() {}

  public allowScale() {}

  public allowTranslate(): boolean {
    if (this === this.root && !this.isSourceNode) return false;
    const { translatable } = this.designerProps;
    if (translatable?.x && translatable?.y) return true;
    return false;
  }

  public allowDelete() {
    if (this === this.root) return false;
    return this.designerProps.deletable ?? true;
  }

  public findById(id: string) {
    if (!id) return;
    if (this.id === id) return this;
    if (this.children?.length > 0) {
      return TreeNodes.get(id);
    }
  }

  public contains(...nodes: TreeNode[]) {
    return nodes.every((node) => {
      if (node === this || node?.parent === this || node?.getParentByDepth(this.depth) === this) {
        return true;
      }
      return false;
    });
  }

  public eachTree(callback?: (node: TreeNode) => void | boolean) {
    if (isFn(callback)) {
      callback(this.root);
      this.root?.eachChildren(callback);
    }
  }

  public eachChildren(callback?: (node: TreeNode) => void | boolean) {
    if (isFn(callback)) {
      for (let i = 0; i < this.children.length; i++) {
        const node = this.children[i];
        if (callback(node) === false) return;
        node.eachChildren(callback);
      }
    }
  }

  public resetNodesParent(nodes: TreeNode[], parent: TreeNode) {
    return resetNodesParent(
      nodes.filter((node) => node !== this),
      parent,
    );
  }

  public setProps(props?: any) {
    return this.triggerMutation(
      new UpdateNodePropsEvent({
        target: this,
        source: null,
      }),
      () => {
        Object.assign(this.props, props);
      },
    );
  }

  public setComponentName(componentName: string) {
    this.componentName = componentName;
  }

  public prepend(...nodes: TreeNode[]) {
    if (nodes.some((node) => node.contains(this))) return [];
    const originSourceParents = nodes.map((node) => node.parent);
    const newNodes = this.resetNodesParent(nodes, this);
    if (!newNodes.length) return [];
    return this.triggerMutation(
      new PrependNodeEvent({
        originSourceParents,
        target: this,
        source: newNodes,
      }),
      () => {
        this.children = newNodes.concat(this.children);
        return newNodes;
      },
      [],
    );
  }

  public append(...nodes: TreeNode[]) {
    if (nodes.some((node) => node.contains(this))) return [];
    const originSourceParents = nodes.map((node) => node.parent);
    const newNodes = this.resetNodesParent(nodes, this);
    if (!newNodes.length) return [];
    return this.triggerMutation(
      new AppendNodeEvent({
        originSourceParents,
        target: this,
        source: newNodes,
      }),
      () => {
        this.children = this.children.concat(newNodes);
        return newNodes;
      },
      [],
    );
  }

  public wrap(wrapper: TreeNode) {
    if (wrapper === this) return;
    const parent = this.parent;
    return this.triggerMutation(
      new WrapNodeEvent({
        target: this,
        source: wrapper,
      }),
      () => {
        resetParent(this, wrapper);
        resetParent(wrapper, parent);
        return wrapper;
      },
    );
  }

  public insertAfter(...nodes: TreeNode[]) {
    const parent = this.parent;
    if (nodes.some((node) => node.contains(this))) return [];
    if (parent?.children?.length) {
      const originSourceParents = nodes.map((node) => node.parent);
      const newNodes = this.resetNodesParent(nodes, parent);
      if (!newNodes.length) return [];

      return this.triggerMutation(
        new InsertAfterEvent({
          originSourceParents,
          target: this,
          source: newNodes,
        }),
        () => {
          parent.children = parent.children.reduce((buf, node) => {
            if (node === this) {
              return buf.concat([node]).concat(newNodes);
            } else {
              return buf.concat([node]);
            }
          }, []);
          return newNodes;
        },
        [],
      );
    }
    return [];
  }

  public insertBefore(...nodes: TreeNode[]) {
    const parent = this.parent;
    if (nodes.some((node) => node.contains(this))) return [];
    if (parent?.children?.length) {
      const originSourceParents = nodes.map((node) => node.parent);
      const newNodes = this.resetNodesParent(nodes, parent);
      if (!newNodes.length) return [];
      return this.triggerMutation(
        new InsertBeforeEvent({
          originSourceParents,
          target: this,
          source: newNodes,
        }),
        () => {
          parent.children = parent.children.reduce((buf, node) => {
            if (node === this) {
              return buf.concat(newNodes).concat([node]);
            } else {
              return buf.concat([node]);
            }
          }, []);
          return newNodes;
        },
        [],
      );
    }
    return [];
  }

  public insertChildren(start: number, ...nodes: TreeNode[]) {
    if (nodes.some((node) => node.contains(this))) return [];
    if (this.children?.length) {
      const originSourceParents = nodes.map((node) => node.parent);
      const newNodes = this.resetNodesParent(nodes, this);
      if (!newNodes.length) return [];
      return this.triggerMutation(
        new InsertChildrenEvent({
          originSourceParents,
          target: this,
          source: newNodes,
        }),
        () => {
          this.children = this.children.reduce((buf, node, index) => {
            if (index === start) {
              return buf.concat(newNodes).concat([node]);
            }
            return buf.concat([node]);
          }, []);
          return newNodes;
        },
        [],
      );
    }
    return [];
  }

  public setChildren(...nodes: TreeNode[]) {
    const originSourceParents = nodes.map((node) => node.parent);
    const newNodes = this.resetNodesParent(nodes, this);
    return this.triggerMutation(
      new UpdateChildrenEvent({
        originSourceParents,
        target: this,
        source: newNodes,
      }),
      () => {
        this.children = newNodes;
        return newNodes;
      },
      [],
    );
  }

  public remove() {
    return this.triggerMutation(
      new RemoveNodeEvent({
        target: this,
        source: null,
      }),
      () => {
        removeNode(this);
        TreeNodes.delete(this.id);
      },
    );
  }

  public clone(parent?: TreeNode) {
    const newNode = new TreeNode(
      {
        id: uid(),
        componentName: this.componentName,
        sourceName: this.sourceName,
        props: toJS(this.props),
        children: [],
        containerClassName: this.containerClassName,
      },
      parent ? parent : this.parent,
    );
    newNode.children = resetNodesParent(
      this.children.map((child) => {
        return child.clone(newNode);
      }),
      newNode,
    );
    return this.triggerMutation(
      new CloneNodeEvent({
        target: this,
        source: newNode,
      }),
      () => newNode,
    );
  }

  public from(node?: ITreeNode) {
    if (!node) return;
    return this.triggerMutation(
      new FromNodeEvent({
        target: this,
        source: node,
      }),
      () => {
        if (node.id && node.id !== this.id) {
          TreeNodes.delete(this.id);
          TreeNodes.set(node.id, this);
          this.id = node.id;
        }
        if (node.componentName) {
          this.componentName = node.componentName;
        }
        this.props = node.props ?? {};
        if (node.hidden) {
          this.hidden = node.hidden;
        }
        if (node.containerClassName) {
          this.containerClassName = node.containerClassName;
        }
        if (node.children) {
          this.children =
            node.children?.map?.((node) => {
              return new TreeNode(node, this);
            }) || [];
        }
      },
    );
  }

  public serialize(): ITreeNode {
    return {
      id: this.id,
      componentName: this.componentName,
      sourceName: this.sourceName,
      props: toJS(this.props),
      hidden: this.hidden,
      containerClassName: this.containerClassName,
      children: this.children.map((treeNode) => {
        return treeNode.serialize();
      }),
    };
  }

  public static create(node: ITreeNode, parent?: TreeNode) {
    return new TreeNode(node, parent);
  }

  public static findById(id: string) {
    return TreeNodes.get(id);
  }

  public static remove(nodes: TreeNode[] = []) {
    for (let i = nodes.length - 1; i >= 0; i--) {
      const node = nodes[i];
      if (node.allowDelete()) {
        const previous = node.previous;
        const next = node.next;
        node.remove();
        node.operation?.selection.select(previous ? previous : next ? next : node.parent);
        node.operation?.hover.clear();
      }
    }
  }

  public static sort(nodes: TreeNode[] = []) {
    return nodes.sort((before, after) => {
      if (before.depth !== after.depth) return 0;
      return before.index - after.index >= 0 ? 1 : -1;
    });
  }

  public static clone(nodes: TreeNode[] = []) {
    const groups: { [parentId: string]: TreeNode[] } = {};
    const lastGroupNode: { [parentId: string]: TreeNode } = {};
    const filterNestedNode = TreeNode.sort(nodes).filter((node) => {
      return !nodes.some((parent) => {
        return node.isMyParents(parent);
      });
    });
    each(filterNestedNode, (node) => {
      if (node === node.root) return;
      if (!node.allowClone()) return;
      if (!node?.operation) return;
      groups[node?.parent?.id] = groups[node?.parent?.id] || [];
      groups[node?.parent?.id].push(node);
      if (lastGroupNode[node?.parent?.id]) {
        if (node.index > lastGroupNode[node?.parent?.id].index) {
          lastGroupNode[node?.parent?.id] = node;
        }
      } else {
        lastGroupNode[node?.parent?.id] = node;
      }
    });
    const parents = new Map<TreeNode, TreeNode[]>();
    each(groups, (nodes, parentId) => {
      const lastNode = lastGroupNode[parentId];
      let insertPoint = lastNode;
      each(nodes, (node) => {
        const cloned = node.clone();
        if (!cloned) return;
        if (node.operation?.selection.has(node) && insertPoint.parent.allowAppend([cloned])) {
          insertPoint.insertAfter(cloned);
          insertPoint = insertPoint.next;
        } else if (node.operation.selection.length === 1) {
          const targetNode = node.operation?.tree.findById(node.operation.selection.first);
          let cloneNodes = parents.get(targetNode);
          if (!cloneNodes) {
            cloneNodes = [];
            parents.set(targetNode, cloneNodes);
          }
          if (targetNode && targetNode.allowAppend([cloned])) {
            cloneNodes.push(cloned);
          }
        }
      });
    });
    parents.forEach((nodes, target) => {
      if (!nodes.length) return;
      target.append(...nodes);
    });
  }

  public static filterResizable(nodes: TreeNode[] = []) {
    return nodes.filter((node) => node.allowResize());
  }

  public static filterRotatable(nodes: TreeNode[] = []) {
    return nodes.filter((node) => node.allowRotate());
  }

  public static filterScalable(nodes: TreeNode[] = []) {
    return nodes.filter((node) => node.allowScale());
  }

  public static filterRoundable(nodes: TreeNode[] = []) {
    return nodes.filter((node) => node.allowRound());
  }

  public static filterTranslatable(nodes: TreeNode[] = []) {
    return nodes.filter((node) => node.allowTranslate());
  }

  public static filterDraggable(nodes: TreeNode[] = []) {
    return nodes.reduce((buf, node) => {
      if (!node.allowDrag()) return buf;
      if (isFn(node?.designerProps?.getDragNodes)) {
        const transformed = node.designerProps.getDragNodes(node);
        return transformed ? buf.concat(transformed) : buf;
      }
      if (node.componentName === '$$ResourceNode$$') return buf.concat(node.children);
      return buf.concat([node]);
    }, []);
  }

  public static filterDroppable(nodes: TreeNode[] = [], parent: TreeNode) {
    return nodes.reduce((buf, node) => {
      if (!node.allowDrop(parent)) return buf;
      if (isFn(node.designerProps?.getDropNodes)) {
        const cloned = node.isSourceNode ? node.clone(node.parent) : node;
        const transformed = node.designerProps.getDropNodes(cloned, parent);
        return transformed ? buf.concat(transformed) : buf;
      }
      if (node.componentName === '$$ResourceNode$$') return buf.concat(node.children);
      return buf.concat([node]);
    }, []);
  }
}
