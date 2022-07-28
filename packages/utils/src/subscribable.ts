import { isFn } from './types';

const UNSUBSCRIBE_ID_SYMBOL = Symbol('UNSUBSCRIBE_ID_SYMBOL');

export interface ISubscriber<Palyload = any> {
  (payload: Palyload): void | boolean;
}

export class Subscribable<ExtendsType = any> {
  private _subscribers: {
    index: number;
    [key: number]: ISubscriber;
  } = {
    index: 0,
  };

  public dispatch<T extends ExtendsType = any>(event: T, context?: any) {
    let interrupted = false;
    Object.keys(this._subscribers).forEach((key) => {
      const subscriber = this._subscribers[key];
      if (isFn(subscriber)) {
        event['context'] = context;
        if (subscriber(event) === false) {
          interrupted = true;
        }
      }
    });
    return interrupted ? false : true;
  }

  public subscribe(subscriber: ISubscriber) {
    let id: number;
    if (isFn(subscriber)) {
      id = this._subscribers.index + 1;
      this._subscribers[id] = subscriber;
      this._subscribers.index++;
    }

    const unsubscribe = () => {
      this.unsubscribe(id);
    };

    unsubscribe[UNSUBSCRIBE_ID_SYMBOL] = id;
    return unsubscribe;
  }

  public unsubscribe(id?: number | string | (() => void)) {
    if (id === undefined || id === null) {
      Object.keys(this._subscribers).forEach((key) => {
        this.unsubscribe(key);
      });
      return;
    }
    if (!isFn(id)) {
      delete this._subscribers[id];
    } else {
      delete this._subscribers[id[UNSUBSCRIBE_ID_SYMBOL]];
    }
  }
}
