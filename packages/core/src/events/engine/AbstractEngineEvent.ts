import { Engine } from '../../models';

export class AbstractEngineEvent {
  public data: any;
  public context: Engine;
  public constructor(data: any) {
    this.data = data;
  }
}
