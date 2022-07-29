import { ICustomEvent } from '@designer/utils';
import { AbstractMutationNodeEvent } from './AbstractMutationNodeEvent';

export class CloneNodeEvent extends AbstractMutationNodeEvent implements ICustomEvent {
  public type: string = 'clone:node';
}
