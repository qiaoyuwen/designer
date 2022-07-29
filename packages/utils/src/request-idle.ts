import 'requestidlecallback';
import { globalThisPolyfill } from './globalThisPolyfill';

export interface IIdleDeadline {
  didTimeout: boolean;
  timeRemaining: () => DOMHighResTimeStamp;
}

export interface IIdleCallbackOptions {
  timeout?: number;
}

export const requestIdle = (callback: (params: IIdleDeadline) => void, options?: IIdleCallbackOptions): number => {
  return globalThisPolyfill['requestIdleCallback'](callback, options);
};

export const cancelIdle = (id: number) => {
  globalThisPolyfill['cancelIdleCallback'](id);
};
