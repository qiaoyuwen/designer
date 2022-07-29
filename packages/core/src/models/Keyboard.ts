import { observable, define, action } from '@formily/reactive';
import { KeyCode } from '@designer/utils';
import { Engine } from './Engine';
import { Shortcut } from './Shortcut';
import { AbstractKeyboardEvent } from '../events/keyboard/AbstractKeyboardEvent';
import { IEngineContext } from '../types';

const Modifiers: [string, KeyCode][] = [
  ['metaKey', KeyCode.Meta],
  ['shiftKey', KeyCode.Shift],
  ['ctrlKey', KeyCode.Control],
  ['altKey', KeyCode.Alt],
];

export interface IKeyboard {
  engine: Engine;
}

export class Keyboard {
  public engine: Engine;
  public shortcuts: Shortcut[] = [];
  public sequence: KeyCode[] = [];
  public keyDown: KeyCode = null;
  public modifiers: Record<string, any> = {};
  public requestTimer: any = null;

  public constructor(engine?: Engine) {
    this.engine = engine;
    this.shortcuts = engine.props?.shortcuts || [];
    this.makeObservable();
  }

  public matchCodes(context: IEngineContext) {
    for (let i = 0; i < this.shortcuts.length; i++) {
      const shortcut = this.shortcuts[i];
      if (shortcut.match(this.sequence, context)) {
        return true;
      }
    }
    return false;
  }

  public preventCodes() {
    return this.shortcuts.some((shortcut) => {
      return shortcut.preventCodes(this.sequence);
    });
  }

  public includes(key: KeyCode) {
    return this.sequence.some((code) => Shortcut.matchCode(code, key));
  }

  public excludes(key: KeyCode) {
    this.sequence = this.sequence.filter((code) => !Shortcut.matchCode(key, code));
  }

  public addKeyCode(key: KeyCode) {
    if (!this.includes(key)) {
      this.sequence.push(key);
    }
  }

  public removeKeyCode(key: KeyCode) {
    if (this.includes(key)) {
      this.excludes(key);
    }
  }

  public isModifier(code: KeyCode) {
    return Modifiers.some((modifier) => Shortcut.matchCode(modifier[1], code));
  }

  public handleModifiers(event: AbstractKeyboardEvent) {
    Modifiers.forEach(([key, code]) => {
      if (event[key]) {
        if (!this.includes(code)) {
          this.sequence = [code].concat(this.sequence);
        }
      }
    });
  }

  public handleKeyboard(event: AbstractKeyboardEvent, context: IEngineContext) {
    if (event.eventType === 'keydown') {
      this.keyDown = event.data;
      this.addKeyCode(this.keyDown);
      this.handleModifiers(event);
      if (this.matchCodes(context)) {
        this.sequence = [];
      }
      this.requestClean(4000);
      if (this.preventCodes()) {
        event.preventDefault();
        event.stopPropagation();
      }
    } else {
      if (this.isModifier(event.data)) {
        this.sequence = [];
      }
      this.keyDown = null;
    }
  }

  public isKeyDown(code: KeyCode) {
    return this.keyDown === code;
  }

  public requestClean(duration: number = 4 * 1000) {
    clearTimeout(this.requestTimer);
    this.requestTimer = setTimeout(() => {
      this.keyDown = null;
      this.sequence = [];
      clearTimeout(this.requestTimer);
    }, duration);
  }

  public makeObservable() {
    define(this, {
      sequence: observable.shallow,
      keyDown: observable.ref,
      handleKeyboard: action,
    });
  }
}
