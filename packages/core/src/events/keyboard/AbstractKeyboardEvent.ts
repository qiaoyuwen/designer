import { getKeyCodeFromEvent, KeyCode } from '@designer/utils';
import { IEngineContext } from '../../types';

export class AbstractKeyboardEvent {
  public data: KeyCode;
  public context: IEngineContext;
  public originEvent: KeyboardEvent;
  public constructor(e: KeyboardEvent) {
    this.data = getKeyCodeFromEvent(e);
    this.originEvent = e;
  }

  public get eventType() {
    return this.originEvent.type;
  }

  public get ctrlKey() {
    return this.originEvent.ctrlKey;
  }

  public get shiftKey() {
    return this.originEvent.shiftKey;
  }

  public get metaKey() {
    return this.originEvent.metaKey;
  }

  public get altkey() {
    return this.originEvent.altKey;
  }

  public preventDefault() {
    if (this.originEvent.preventDefault) {
      this.originEvent.preventDefault();
    } else {
      this.originEvent.returnValue = false;
    }
  }

  public stopPropagation() {
    if (this.originEvent?.stopPropagation) {
      this.originEvent.stopPropagation();
    } else {
      this.originEvent.cancelBubble = true;
    }
  }
}
