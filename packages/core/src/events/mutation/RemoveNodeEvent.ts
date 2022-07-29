import { ICustomEvent } from '@designer/utils';
import { AbstractMutationNodeEvent } from './AbstractMutationNodeEvent';

export class RemoveNodeEvent extends AbstractMutationNodeEvent implements ICustomEvent {
  public type: string = 'remove:node';
}
