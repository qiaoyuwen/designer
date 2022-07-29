import { ICustomEvent } from '@designer/utils';
import { AbstractWorkspaceEvent } from './AbstractWorkspaceEvent';

export class SwitchWorkspaceEvent extends AbstractWorkspaceEvent implements ICustomEvent {
  public type: string = 'switch:workspace';
}
