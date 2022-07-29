import { ICustomEvent } from '@designer/utils';
import { AbstractKeyboardEvent } from './AbstractKeyboardEvent';

export class KeyUpEvent extends AbstractKeyboardEvent implements ICustomEvent {
  public type: string = 'key:up';
}
