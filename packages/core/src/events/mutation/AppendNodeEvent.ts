import { ICustomEvent } from '@designer/utils';
import { AbstractMutationNodeEvent } from './AbstractMutationNodeEvent';

export class AppendNodeEvent extends AbstractMutationNodeEvent implements ICustomEvent {
  public type: string = 'append:node';
}
