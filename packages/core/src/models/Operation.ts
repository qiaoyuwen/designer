import { Workspace } from './Workspace';
import { Engine } from './Engine';
import { TreeNode, ITreeNode } from './TreeNode';
import { Selection } from './Selection';
import { Hover } from './Hover';
import { TransformHelper } from './TransformHelper';
import { MoveHelper } from './MoveHelper';
import { cancelIdle, ICustomEvent, isFn, requestIdle } from '@designer/utils';

export interface IOperation {
  tree?: ITreeNode;
  selected?: string[];
}

export class Operation {
  public workspace: Workspace;

  public engine: Engine;

  public tree: TreeNode;

  public selection: Selection;

  public hover: Hover;

  public transformHelper: TransformHelper;

  public moveHelper: MoveHelper;

  public requests: {
    snapshot: any;
  } = {
    snapshot: null,
  };

  public constructor(workspace: Workspace) {
    this.engine = workspace.engine;
    this.workspace = workspace;
    this.tree = new TreeNode({
      componentName: this.engine.props.rootComponentName,
      ...this.engine.props.defaultComponentTree,
      operation: this,
    });
    this.hover = new Hover({
      operation: this,
    });
    this.selection = new Selection({
      operation: this,
    });
    this.moveHelper = new MoveHelper({
      operation: this,
    });
    this.transformHelper = new TransformHelper({
      operation: this,
    });
    this.selection.select(this.tree);
  }

  public dispatch(event: ICustomEvent, callback?: () => void) {
    if (this.workspace.dispatch(event) === false) return;
    if (isFn(callback)) return callback();
  }

  public snapshot(type?: string) {
    cancelIdle(this.requests.snapshot);
    if (!this.workspace || !this.workspace.history || this.workspace.history.locking) return;
    this.requests.snapshot = requestIdle(() => {
      this.workspace.history.push(type);
    });
  }

  public from(operation?: IOperation) {
    if (!operation) return;
    if (operation.tree) {
      this.tree.from(operation.tree);
    }
    if (operation.selected) {
      this.selection.selected = operation.selected;
    }
  }

  public serialize(): IOperation {
    return {
      tree: this.tree.serialize(),
      selected: [this.tree.id],
    };
  }
}
