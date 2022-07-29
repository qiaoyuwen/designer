import { ICustomEvent } from '@designer/utils';
import { AbstractMutationNodeEvent } from './AbstractMutationNodeEvent';

export class DragNodeEvent extends AbstractMutationNodeEvent implements ICustomEvent {
  public type: string = 'drag:node';
}
