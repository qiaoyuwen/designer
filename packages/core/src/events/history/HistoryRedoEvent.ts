import { ICustomEvent } from '@designer/utils';
import { AbstractHistoryEvent } from './AbstractHistoryEvent';

export class HistoryUndoEvent extends AbstractHistoryEvent implements ICustomEvent {
  public type: string = 'history:undo';
}
