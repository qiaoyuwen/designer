import { ICustomEvent } from '@designer/utils';
import { AbstractCursorEvent } from './AbstractCursorEvent';

export class MouseClickEvent extends AbstractCursorEvent implements ICustomEvent {
  public type: string = 'mouse:click';
}

export class MouseDoubleClickEvent extends AbstractCursorEvent implements ICustomEvent {
  public type: string = 'mouse:dblclick';
}
