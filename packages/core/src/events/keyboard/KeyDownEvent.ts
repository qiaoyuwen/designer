import { ICustomEvent } from '@designer/utils';
import { AbstractKeyboardEvent } from './AbstractKeyboardEvent';

export class KeyDownEvent extends AbstractKeyboardEvent implements ICustomEvent {
  public type: string = 'key:down';
}
