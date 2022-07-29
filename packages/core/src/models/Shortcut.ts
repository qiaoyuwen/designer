import { isFn, KeyCode } from '@designer/utils';
import { IEngineContext } from '../types';

export { KeyCode };

export interface IShortcutProps {
  codes?: KeyCode[] | KeyCode[][];
  matcher?: (codes: KeyCode[]) => boolean;
  handler?: (context: IEngineContext) => void;
}

export class Shortcut {
  public codes: KeyCode[][];
  public handler: (context: IEngineContext) => void;
  public matcher: (codes: KeyCode[]) => boolean;
  public constructor(props: IShortcutProps) {
    this.codes = this.parseCodes(props.codes);
    this.handler = props.handler;
    this.matcher = props.matcher;
  }

  public parseCodes(codes: Array<KeyCode | KeyCode[]>) {
    const results: KeyCode[][] = [];
    codes.forEach((code) => {
      if (Array.isArray(code)) {
        results.push(code);
      } else {
        results.push([code]);
      }
    });
    return results;
  }

  public preventCodes(codes: KeyCode[]) {
    if (this.codes.length) {
      for (let i = 0; i < codes.length; i++) {
        const sequence = this.codes[i] ?? [];
        for (let j = 0; j < sequence.length; j++) {
          if (!Shortcut.matchCode(codes[j], sequence[j])) {
            return false;
          }
        }
      }
      return true;
    }
    return false;
  }

  public matched(matched: boolean, context: IEngineContext) {
    if (isFn(this.handler) && matched) {
      this.handler(context);
    }
    return matched;
  }

  public match(codes: KeyCode[], context: IEngineContext) {
    return this.codes.some((sequence) => {
      const sortedSelf = Shortcut.sortCodes(sequence);
      const sortedTarget: KeyCode[] = Shortcut.sortCodes(codes);
      if (isFn(this.matcher)) {
        return this.matched(this.matcher(sortedTarget), context);
      }
      if (sortedTarget.length !== sortedSelf.length) return this.matched(false, context);
      for (let i = 0; i < sortedSelf.length; i++) {
        if (!Shortcut.matchCode(sortedTarget[i], sortedSelf[i])) {
          return this.matched(false, context);
        }
      }
      return this.matched(true, context);
    });
  }

  public static matchCode = (code1: KeyCode, code2: KeyCode) => {
    return code1?.toLocaleLowerCase?.() === code2?.toLocaleLowerCase?.();
  };

  public static sortCodes = (codes: KeyCode[]): KeyCode[] => {
    return codes.map((code) => code.toLocaleLowerCase()).sort() as any;
  };
}
