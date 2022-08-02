import { ICustomEvent } from '@designer/utils';
import { AbstractCursorEvent } from './AbstractCursorEvent';

export class DragStartEvent extends AbstractCursorEvent implements ICustomEvent {
  public type: string = 'drag:start';
}
