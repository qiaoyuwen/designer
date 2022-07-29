import { ICustomEvent } from '@designer/utils';
import { AbstractWorkspaceEvent } from './AbstractWorkspaceEvent';

export class RemoveWorkspaceEvent extends AbstractWorkspaceEvent implements ICustomEvent {
  public type: string = 'remove:workspace';
}
