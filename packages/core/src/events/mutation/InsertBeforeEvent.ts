import { ICustomEvent } from '@designer/utils';
import { AbstractMutationNodeEvent } from './AbstractMutationNodeEvent';

export class InsertBeforeEvent extends AbstractMutationNodeEvent implements ICustomEvent {
  public type: string = 'insert:before';
}
