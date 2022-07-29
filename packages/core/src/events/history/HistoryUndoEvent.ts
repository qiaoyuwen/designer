import { ICustomEvent } from '@designer/utils';
import { AbstractHistoryEvent } from './AbstractHistoryEvent';

export class HistoryRedoEvent extends AbstractHistoryEvent implements ICustomEvent {
  public type: string = 'history:redo';
}
