import { Operation } from './Operation';
import { TreeNode } from './TreeNode';
import { observable, define, action } from '@formily/reactive';
import {
  calcDistanceOfPointToRect,
  calcDistancePointToEdge,
  isNearAfter,
  isPointInRect,
  IPoint,
  Rect,
} from '@designer/utils';
import { DragNodeEvent, DropNodeEvent } from '../events';
import { Viewport } from './Viewport';
import { CursorDragType } from './Cursor';

export enum ClosestPosition {
  Before = 'BEFORE',
  ForbidBefore = 'FORBID_BEFORE',
  After = 'After',
  ForbidAfter = 'FORBID_AFTER',
  Upper = 'UPPER',
  ForbidUpper = 'FORBID_UPPER',
  Under = 'UNDER',
  ForbidUnder = 'FORBID_UNDER',
  Inner = 'INNER',
  ForbidInner = 'FORBID_INNER',
  InnerAfter = 'INNER_AFTER',
  ForbidInnerAfter = 'FORBID_INNER_AFTER',
  InnerBefore = 'INNER_BEFORE',
  ForbidInnerBefore = 'FORBID_INNER_BEFORE',
  Forbid = 'FORBID',
}

export interface IMoveHelperProps {
  operation: Operation;
}

export interface IMoveHelperDragStartProps {
  dragNodes: TreeNode[];
}

export interface IMoveHelperDragDropProps {
  dropNode: TreeNode;
}
export interface IMoveHelperDragMoveProps {
  touchNode: TreeNode;
  point: IPoint;
}

export class MoveHelper {
  public operation: Operation;

  public rootNode: TreeNode;

  public dragNodes: TreeNode[] = [];

  public touchNode: TreeNode = null;

  public closestNode: TreeNode = null;

  public activeViewport: Viewport = null;

  public viewportClosestRect: Rect = null;

  public outlineClosestRect: Rect = null;

  public viewportClosestOffsetRect: Rect = null;

  public outlineClosestOffsetRect: Rect = null;

  public viewportClosestDirection: ClosestPosition = null;

  public outlineClosestDirection: ClosestPosition = null;

  public dragging: boolean = false;

  public constructor(props: IMoveHelperProps) {
    this.operation = props.operation;
    this.rootNode = this.operation.tree;
    this.makeObservable();
  }

  public get cursor() {
    return this.operation.engine.cursor;
  }

  public get viewport() {
    return this.operation.workspace.viewport;
  }

  public get outline() {
    return this.operation.workspace.outline;
  }

  public get hasDragNodes() {
    return this.dragNodes.length > 0;
  }

  public get closestDirection() {
    if (this.activeViewport === this.outline) {
      return this.outlineClosestDirection;
    }
    return this.viewportClosestDirection;
  }

  public getClosestLayout(viewport: Viewport) {
    return viewport.getValidNodeLayout(this.closestNode);
  }

  public calcClosestPosition(point: IPoint, viewport: Viewport): ClosestPosition {
    const closestNode = this.closestNode;
    if (!closestNode || !viewport.isPointInViewport(point)) return ClosestPosition.Forbid;
    const closestRect = viewport.getValidNodeClientRect(closestNode);
    const isInline = this.getClosestLayout(viewport) === 'horizontal';
    if (!closestRect) {
      return;
    }
    const isAfter = isNearAfter(point, closestRect, viewport.moveInsertionType === 'block' ? false : isInline);
    const getValidParent = (node: TreeNode) => {
      if (!node) return;
      if (node.parent?.allowSibling(this.dragNodes)) return node.parent;
      return getValidParent(node.parent);
    };
    if (isPointInRect(point, closestRect, viewport.moveSensitive)) {
      if (!closestNode.allowAppend(this.dragNodes)) {
        if (!closestNode.allowSibling(this.dragNodes)) {
          const parentClosestNode = getValidParent(closestNode);
          if (parentClosestNode) {
            this.closestNode = parentClosestNode;
          }
          if (isInline) {
            if (parentClosestNode) {
              if (isAfter) {
                return ClosestPosition.After;
              }
              return ClosestPosition.Before;
            }
            if (isAfter) {
              return ClosestPosition.ForbidAfter;
            }
            return ClosestPosition.ForbidBefore;
          } else {
            if (parentClosestNode) {
              if (isAfter) {
                return ClosestPosition.Under;
              }
              return ClosestPosition.Upper;
            }
            if (isAfter) {
              return ClosestPosition.ForbidUnder;
            }
            return ClosestPosition.ForbidUpper;
          }
        } else {
          if (isInline) {
            return isAfter ? ClosestPosition.After : ClosestPosition.Before;
          } else {
            return isAfter ? ClosestPosition.Under : ClosestPosition.Upper;
          }
        }
      }
      if (closestNode.contains(...this.dragNodes)) {
        if (isAfter) {
          return ClosestPosition.InnerAfter;
        }
        return ClosestPosition.InnerBefore;
      } else {
        return ClosestPosition.Inner;
      }
    } else if (closestNode === closestNode.root) {
      return isAfter ? ClosestPosition.InnerAfter : ClosestPosition.InnerBefore;
    } else {
      if (!closestNode.allowSibling(this.dragNodes)) {
        const parentClosestNode = getValidParent(closestNode);
        if (parentClosestNode) {
          this.closestNode = parentClosestNode;
        }
        if (isInline) {
          if (parentClosestNode) {
            if (isAfter) {
              return ClosestPosition.After;
            }
            return ClosestPosition.Before;
          }
          return isAfter ? ClosestPosition.ForbidAfter : ClosestPosition.ForbidBefore;
        } else {
          if (parentClosestNode) {
            if (isAfter) {
              return ClosestPosition.Under;
            }
            return ClosestPosition.Upper;
          }
          return isAfter ? ClosestPosition.ForbidUnder : ClosestPosition.ForbidUpper;
        }
      }
      if (isInline) {
        return isAfter ? ClosestPosition.After : ClosestPosition.Before;
      } else {
        return isAfter ? ClosestPosition.Under : ClosestPosition.Upper;
      }
    }
  }

  public calcClosestNode(point: IPoint, viewport: Viewport): TreeNode {
    if (this.touchNode) {
      const touchNodeRect = viewport.getValidNodeClientRect(this.touchNode);
      if (!touchNodeRect) return;
      if (this.touchNode?.children?.length) {
        const touchDistance = calcDistancePointToEdge(point, touchNodeRect);
        let minDistance = touchDistance;
        let minDistanceNode = this.touchNode;
        this.touchNode.eachChildren((node) => {
          const rect = viewport.getElementClientRectById(node.id);
          if (!rect) return;
          const distance = isPointInRect(point, rect, viewport.moveSensitive)
            ? 0
            : calcDistanceOfPointToRect(point, rect);
          if (distance <= minDistance) {
            minDistance = distance;
            minDistanceNode = node;
          }
        });
        return minDistanceNode;
      } else {
        return this.touchNode;
      }
    }
    return this.operation.tree;
  }

  public calcClosestRect(viewport: Viewport, closestDirection: ClosestPosition): Rect {
    const closestNode = this.closestNode;
    if (!closestNode || !closestDirection) return;
    const closestRect = viewport.getValidNodeClientRect(closestNode);
    if (closestDirection === ClosestPosition.InnerAfter || closestDirection === ClosestPosition.InnerBefore) {
      return viewport.getChildrenClientRect(closestNode);
    } else {
      return closestRect;
    }
  }

  public calcClosestOffsetRect(viewport: Viewport, closestDirection: ClosestPosition): Rect {
    const closestNode = this.closestNode;
    if (!closestNode || !closestDirection) return;
    const closestRect = viewport.getValidNodeOffsetRect(closestNode);
    if (closestDirection === ClosestPosition.InnerAfter || closestDirection === ClosestPosition.InnerBefore) {
      return viewport.getChildrenOffsetRect(closestNode);
    } else {
      return closestRect;
    }
  }

  public dragStart(props: IMoveHelperDragStartProps) {
    const nodes = TreeNode.filterDraggable(props?.dragNodes);
    if (nodes.length) {
      this.dragNodes = nodes;
      this.trigger(
        new DragNodeEvent({
          target: this.operation.tree,
          source: this.dragNodes,
        }),
      );
      this.viewport.cacheElements();
      this.cursor.setDragType(CursorDragType.Move);
      this.dragging = true;
    }
  }

  public dragMove(props: IMoveHelperDragMoveProps) {
    const { point, touchNode } = props;
    if (!this.dragging) return;
    if (this.outline.isPointInViewport(point, false)) {
      this.activeViewport = this.outline;
      this.touchNode = touchNode;
      this.closestNode = this.calcClosestNode(point, this.outline);
    } else if (this.viewport.isPointInViewport(point, false)) {
      this.activeViewport = this.viewport;
      this.touchNode = touchNode;
      this.closestNode = this.calcClosestNode(point, this.viewport);
    }
    if (!this.activeViewport) return;

    if (this.activeViewport === this.outline) {
      this.outlineClosestDirection = this.calcClosestPosition(point, this.outline);
      this.viewportClosestDirection = this.outlineClosestDirection;
    } else {
      this.viewportClosestDirection = this.calcClosestPosition(point, this.viewport);
      this.outlineClosestDirection = this.viewportClosestDirection;
    }
    if (this.outline.mounted) {
      this.outlineClosestRect = this.calcClosestRect(this.outline, this.outlineClosestDirection);
      this.outlineClosestOffsetRect = this.calcClosestOffsetRect(this.outline, this.outlineClosestDirection);
    }
    if (this.viewport.mounted) {
      this.viewportClosestRect = this.calcClosestRect(this.viewport, this.viewportClosestDirection);
      this.viewportClosestOffsetRect = this.calcClosestOffsetRect(this.viewport, this.viewportClosestDirection);
    }
  }

  public dragDrop(props: IMoveHelperDragDropProps) {
    this.trigger(
      new DropNodeEvent({
        target: this.operation.tree,
        source: props?.dropNode,
      }),
    );
  }

  public dragEnd() {
    this.dragging = false;
    this.dragNodes = [];
    this.touchNode = null;
    this.closestNode = null;
    this.activeViewport = null;
    this.outlineClosestDirection = null;
    this.outlineClosestOffsetRect = null;
    this.outlineClosestRect = null;
    this.viewportClosestDirection = null;
    this.viewportClosestOffsetRect = null;
    this.viewportClosestRect = null;
    this.viewport.clearCache();
  }

  public trigger(event: any) {
    if (this.operation) {
      return this.operation.dispatch(event);
    }
  }

  public makeObservable() {
    define(this, {
      dragging: observable.ref,
      dragNodes: observable.ref,
      touchNode: observable.ref,
      closestNode: observable.ref,
      outlineClosestDirection: observable.ref,
      outlineClosestOffsetRect: observable.ref,
      outlineClosestRect: observable.ref,
      viewportClosestDirection: observable.ref,
      viewportClosestOffsetRect: observable.ref,
      viewportClosestRect: observable.ref,
      dragStart: action,
      dragMove: action,
      dragEnd: action,
    });
  }
}
