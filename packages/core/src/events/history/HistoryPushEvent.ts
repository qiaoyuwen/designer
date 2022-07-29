import { ICustomEvent } from '@designer/utils';
import { AbstractHistoryEvent } from './AbstractHistoryEvent';

export class HistoryPushEvent extends AbstractHistoryEvent implements ICustomEvent {
  public type: string = 'history:push';
}
