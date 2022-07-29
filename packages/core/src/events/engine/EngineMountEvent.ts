import { ICustomEvent } from '@designer/utils';
import { AbstractEngineEvent } from './AbstractEngineEvent';

export class EngineMountEvent extends AbstractEngineEvent implements ICustomEvent {
  public type: string = 'engine:mount';
}
