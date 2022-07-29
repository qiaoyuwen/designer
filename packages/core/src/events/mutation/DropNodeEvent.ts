import { ICustomEvent } from '@designer/utils';
import { AbstractMutationNodeEvent } from './AbstractMutationNodeEvent';

export class DropNodeEvent extends AbstractMutationNodeEvent implements ICustomEvent {
  public type: string = 'drop:node';
}
