import { ICustomEvent } from '@designer/utils';
import { AbstractMutationNodeEvent } from './AbstractMutationNodeEvent';

export class UpdateNodePropsEvent extends AbstractMutationNodeEvent implements ICustomEvent {
  public type: string = 'update:node:props';
}
