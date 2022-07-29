import { ICustomEvent } from '@designer/utils';
import { AbstractMutationNodeEvent } from './AbstractMutationNodeEvent';

export class InsertChildrenEvent extends AbstractMutationNodeEvent implements ICustomEvent {
  public type: string = 'insert:children';
}
