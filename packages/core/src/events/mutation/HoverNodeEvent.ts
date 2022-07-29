import { ICustomEvent } from '@designer/utils';
import { AbstractMutationNodeEvent } from './AbstractMutationNodeEvent';

export class HoverNodeEvent extends AbstractMutationNodeEvent implements ICustomEvent {
  public type: string = 'hover:node';
}
