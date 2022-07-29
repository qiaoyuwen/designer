import { ICustomEvent } from '@designer/utils';
import { AbstractMutationNodeEvent } from './AbstractMutationNodeEvent';

export class UpdateChildrenEvent extends AbstractMutationNodeEvent implements ICustomEvent {
  public type: string = 'update:children';
}
