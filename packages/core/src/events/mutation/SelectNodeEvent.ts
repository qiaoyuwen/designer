import { ICustomEvent } from '@designer/utils';
import { AbstractMutationNodeEvent } from './AbstractMutationNodeEvent';

export class SelectNodeEvent extends AbstractMutationNodeEvent implements ICustomEvent {
  public type: string = 'select:node';
}
