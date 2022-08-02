import { IEngineProps } from '../types';
import { ITreeNode, TreeNode } from './TreeNode';
import { Workbench } from './Workbench';
import { Cursor } from './Cursor';
import { Keyboard } from './Keyboard';
import { Screen, ScreenType } from './Screen';
import { Event, uid, globalThisPolyfill, isFn } from '@designer/utils';
import { EngineMountEvent, EngineUnmountEvent } from '../events/engine';

/**
 * 设计器引擎
 */

export class Engine extends Event {
  public id: string;

  public props: IEngineProps<Engine>;

  public cursor: Cursor;

  public workbench: Workbench;

  public keyboard: Keyboard;

  public screen: Screen;

  public static defaultProps: IEngineProps<Engine> = {
    shortcuts: [],
    effects: [],
    drivers: [],
    rootComponentName: 'Root',
    sourceIdAttrName: 'data-designer-source-id',
    nodeIdAttrName: 'data-designer-node-id',
    contentEditableAttrName: 'data-content-editable',
    contentEditableNodeIdAttrName: 'data-content-editable-node-id',
    clickStopPropagationAttrName: 'data-click-stop-propagation',
    nodeSelectionIdAttrName: 'data-designer-node-helpers-id',
    nodeDragHandlerAttrName: 'data-designer-node-drag-handler',
    screenResizeHandlerAttrName: 'data-designer-screen-resize-handler',
    nodeResizeHandlerAttrName: 'data-designer-node-resize-handler',
    nodeRotateHandlerAttrName: 'data-designer-node-rotate-handler',
    outlineNodeIdAttrName: 'data-designer-outline-node-id',
    nodeTranslateAttrName: 'data-designer-node-translate-handler',
    defaultScreenType: ScreenType.PC,
  };

  public constructor(props: IEngineProps<Engine>) {
    super(props);
    this.props = {
      ...Engine.defaultProps,
      ...props,
    };
    this.init();
    this.id = uid();
  }

  public init() {
    this.workbench = new Workbench(this);
    this.screen = new Screen(this);
    this.cursor = new Cursor(this);
    this.keyboard = new Keyboard(this);
  }

  public setCurrentTree(tree?: ITreeNode) {
    if (this.workbench.currentWorkspace) {
      this.workbench.currentWorkspace.operation.tree.from(tree);
    }
  }

  public getCurrentTree() {
    return this.workbench?.currentWorkspace?.operation?.tree;
  }

  public getAllSelectedNodes() {
    let results: TreeNode[] = [];
    for (let i = 0; i < this.workbench.workspaces.length; i++) {
      const workspace = this.workbench.workspaces[i];
      results = results.concat(workspace.operation.selection.selectedNodes);
    }
    return results;
  }

  public findNodeById(id: string) {
    return TreeNode.findById(id);
  }

  public findMovingNodes(): TreeNode[] {
    const results = [];
    this.workbench.eachWorkspace((workspace) => {
      workspace.operation.moveHelper.dragNodes?.forEach((node) => {
        if (!results.includes(node)) {
          results.push(node);
        }
      });
    });
    return results;
  }

  public findTransformingNodes(): TreeNode[] {
    const results = [];
    this.workbench.eachWorkspace((workspace) => {
      workspace.operation.transformHelper.dragNodes?.forEach((node) => {
        if (!results.includes(node)) {
          results.push(node);
        }
      });
    });
    return results;
  }

  public createNode(node: ITreeNode, parent?: TreeNode) {
    return new TreeNode(node, parent);
  }

  public effect(effect: () => (() => void) | void) {
    const disposers = [];
    this.subscribeTo(EngineMountEvent, () => {
      const disposer = effect?.();
      if (isFn(disposer)) {
        disposers.push(disposer);
      }
    });
    this.subscribeTo(EngineUnmountEvent, () => {
      disposers.forEach((disposer) => disposer());
    });
  }

  public mount() {
    this.attachEvents(globalThisPolyfill);
    this.dispatch(new EngineMountEvent(this), this);
  }

  public unmount() {
    this.dispatch(new EngineUnmountEvent(this), this);
    this.detachEvents();
  }
}
