import { EventDriver } from '@designer/utils';
import { KeyDownEvent, KeyUpEvent } from '../events';

function filter(event: KeyboardEvent) {
  const target: any = event.target;
  const { tagName } = target;
  let flag = true;
  // ignore: isContentEditable === 'true', <input> and <textarea> when readOnly state is false, <select>、Web Components
  if (
    target['isContentEditable'] ||
    ((tagName === 'INPUT' ||
      tagName === 'TEXTAREA' ||
      tagName === 'SELECT' ||
      customElements.get(tagName.toLocaleLowerCase())) &&
      !target.readOnly)
  ) {
    flag = false;
  }
  return flag;
}

export class KeyboardDriver extends EventDriver {
  public onKeyDown = (e: KeyboardEvent) => {
    if (!filter(e)) return;
    this.dispatch(new KeyDownEvent(e));
  };

  public onKeyUp = (e: KeyboardEvent) => {
    this.dispatch(new KeyUpEvent(e));
  };

  public attach() {
    this.addEventListener('keydown', this.onKeyDown, {
      mode: 'onlyParent',
    });
    this.addEventListener('keyup', this.onKeyUp, {
      mode: 'onlyParent',
    });
  }

  public detach() {
    this.removeEventListener('keydown', this.onKeyDown, {
      mode: 'onlyParent',
    });
    this.removeEventListener('keyup', this.onKeyUp, {
      mode: 'onlyParent',
    });
  }
}
