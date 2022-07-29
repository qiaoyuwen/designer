import { ICustomEvent } from '@designer/utils';
import { AbstractHistoryEvent } from './AbstractHistoryEvent';

export class HistoryGotoEvent extends AbstractHistoryEvent implements ICustomEvent {
  public type: string = 'history:goto';
}
