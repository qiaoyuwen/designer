import { ICustomEvent } from '@designer/utils';
import { AbstractCursorEvent } from './AbstractCursorEvent';

export class DragMoveEvent extends AbstractCursorEvent implements ICustomEvent {
  public type: string = 'drag:move';
}
