import { ICustomEvent } from '@designer/utils';
import { AbstractMutationNodeEvent } from './AbstractMutationNodeEvent';

export class InsertAfterEvent extends AbstractMutationNodeEvent implements ICustomEvent {
  public type: string = 'insert:after';
}
