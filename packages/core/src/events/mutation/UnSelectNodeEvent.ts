import { ICustomEvent } from '@designer/utils';
import { AbstractMutationNodeEvent } from './AbstractMutationNodeEvent';

export class UnSelectNodeEvent extends AbstractMutationNodeEvent implements ICustomEvent {
  public type: string = 'unselect:node';
}
