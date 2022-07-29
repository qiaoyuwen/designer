import { ICustomEvent } from '@designer/utils';
import { AbstractWorkspaceEvent } from './AbstractWorkspaceEvent';
export class AddWorkspaceEvent extends AbstractWorkspaceEvent implements ICustomEvent {
  public type: string = 'add:workspace';
}
