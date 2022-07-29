import { ICustomEvent } from '@designer/utils';
import { AbstractEngineEvent } from './AbstractEngineEvent';

export class EngineUnmountEvent extends AbstractEngineEvent implements ICustomEvent {
  public type: string = 'engine:unmount';
}
