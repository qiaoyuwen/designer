import { ICustomEvent } from '@designer/utils';
import { AbstractCursorEvent } from './AbstractCursorEvent';

export class DragStopEvent extends AbstractCursorEvent implements ICustomEvent {
  public type: string = 'drag:stop';
}
