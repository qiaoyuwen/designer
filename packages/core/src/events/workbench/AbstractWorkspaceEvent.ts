import { Workspace } from '../../models';
import { IEngineContext } from '../../types';

export class AbstractWorkspaceEvent {
  public data: Workspace;
  public context: IEngineContext;
  public constructor(data: Workspace) {
    this.data = data;
  }
}
