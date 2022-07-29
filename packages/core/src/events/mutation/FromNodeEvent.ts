import { ICustomEvent } from '@designer/utils';
import { ITreeNode, TreeNode } from '../../models';
import { IEngineContext } from '../../types';

export interface IFromNodeEventData {
  //事件发生的数据源
  source: ITreeNode;
  //事件发生的目标对象
  target: TreeNode;
}

export class FromNodeEvent implements ICustomEvent {
  public type: string = 'from:node';
  public data: IFromNodeEventData;
  public context: IEngineContext;
  public constructor(data: IFromNodeEventData) {
    this.data = data;
  }
}
