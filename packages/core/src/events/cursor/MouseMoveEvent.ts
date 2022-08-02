import { ICustomEvent } from '@designer/utils';
import { AbstractCursorEvent } from './AbstractCursorEvent';

export class MouseMoveEvent extends AbstractCursorEvent implements ICustomEvent {
  public type: string = 'mouse:move';
}
