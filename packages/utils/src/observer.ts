import { debounceMicro } from './debounce';

type IdleObserverStatus = 'BUSY' | 'IDLE' | 'BUSY_IDLE';

type IdleObserverHandler = (status: IdleObserverStatus, remainTime: number) => void;

const FRAME_TIME_DURATION = 16;

const IdleManager = {
  status: 'IDLE',
  observers: new Set<IdleObserverHandler>(),
  handler: (deadline: IdleDeadline) => {
    const prevStatus = IdleManager.status;
    const remainTime = deadline.timeRemaining();
    const dispatch = () => {
      IdleManager.observers.forEach((fn) => fn(IdleManager.status as IdleObserverStatus, remainTime));
    };
    if (remainTime > 0 && remainTime < FRAME_TIME_DURATION) {
      IdleManager.status = 'BUSY_IDLE';
      dispatch();
    } else if (remainTime >= FRAME_TIME_DURATION) {
      IdleManager.status = 'IDLE';
    } else {
      if (prevStatus !== 'BUSY') dispatch();
      IdleManager.status = 'BUSY';
    }
    IdleManager.start();
  },
  start: () => {
    requestIdleCallback(IdleManager.handler);
  },
  add(handler: IdleObserverHandler) {
    if (typeof handler === 'function') {
      IdleManager.observers.add(handler);
    }
  },
  remove(handler: IdleObserverHandler) {
    IdleManager.observers.delete(handler);
  },
};

IdleManager.start();
export class IdleObserver {
  public status: IdleObserverStatus;

  private _observer: IdleObserverHandler;

  public constructor(observer: IdleObserverHandler) {
    this._observer = observer;
  }

  public observe = () => {
    IdleManager.observers.add(this._observer);
  };

  public disconnect = () => {
    IdleManager.observers.delete(this._observer);
  };
}

export class PaintObserver {
  private _resizeObserver: ResizeObserver;

  private _mutationObserver: MutationObserver;

  private _idleObserver: IdleObserver;

  private _connected: boolean = false;

  public constructor(observer: () => void = () => {}) {
    const handler = debounceMicro(observer);
    this._resizeObserver = new ResizeObserver(handler);
    this._mutationObserver = new MutationObserver(handler);
    this._idleObserver = new IdleObserver(handler);
  }

  public observe = (target: HTMLElement | Element) => {
    if (!target) return;
    this._resizeObserver.observe(target);
    this._mutationObserver.observe(target, {
      attributeFilter: ['style'],
      attributes: true,
    });
    this._idleObserver.observe();
    this._connected = true;
  };

  public disconnect = () => {
    if (this._connected) {
      this._resizeObserver.disconnect();
      this._mutationObserver.disconnect();
      this._idleObserver.disconnect();
    }
    this._connected = false;
  };
}
