import { observable, define, action } from '@formily/reactive';
import { Operation } from './Operation';
import { TreeNode } from './TreeNode';
import { HoverNodeEvent } from '../events';

export interface IHoverProps {
  operation: Operation;
}

export class Hover {
  public node: TreeNode = null;
  public operation: Operation;
  public constructor(props?: IHoverProps) {
    this.operation = props?.operation;
    this.makeObservable();
  }

  public setHover(node?: TreeNode) {
    if (node) {
      this.node = node;
    } else {
      this.node = null;
    }
    this.trigger();
  }

  public clear() {
    this.node = null;
  }

  public trigger() {
    if (this.operation) {
      return this.operation.dispatch(
        new HoverNodeEvent({
          target: this.operation.tree,
          source: this.node,
        }),
      );
    }
  }

  public makeObservable() {
    define(this, {
      node: observable.ref,
      setHover: action,
      clear: action,
    });
  }
}
