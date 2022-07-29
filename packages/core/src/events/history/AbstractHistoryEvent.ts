import { IEngineContext } from '../../types';

export class AbstractHistoryEvent {
  public data: any;
  public context: IEngineContext;
  public constructor(data: any) {
    this.data = data;
  }
}
