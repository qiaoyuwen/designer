import { ICustomEvent } from '@designer/utils';
import { AbstractMutationNodeEvent } from './AbstractMutationNodeEvent';

export class WrapNodeEvent extends AbstractMutationNodeEvent implements ICustomEvent {
  public type: string = 'wrap:node';
}
