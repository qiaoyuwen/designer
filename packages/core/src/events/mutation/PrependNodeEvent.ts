import { ICustomEvent } from '@designer/utils';
import { AbstractMutationNodeEvent } from './AbstractMutationNodeEvent';

export class PrependNodeEvent extends AbstractMutationNodeEvent implements ICustomEvent {
  public type: string = 'prepend:node';
}
