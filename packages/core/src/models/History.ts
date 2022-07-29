import { define, observable, action } from '@formily/reactive';

export interface IHistoryProps<T> {
  onPush?: (item: T) => void;
  onRedo?: (item: T) => void;
  onUndo?: (item: T) => void;
  onGoto?: (item: T) => void;
}

export interface IHistoryItem<T> {
  data: T;
  type?: string;
  timestamp: number;
}

export interface ISerializable {
  from(json: any): void; //导入数据
  serialize(): any; //序列化模型，用于历史记录保存
}

export class History<T extends ISerializable = any> {
  public context: ISerializable;
  public props: IHistoryProps<IHistoryItem<T>>;
  public current: number = 0;
  public history: IHistoryItem<T>[] = [];
  public updateTimer: number = null;
  public maxSize: number = 100;
  public locking: boolean = false;
  public constructor(context: T, props?: IHistoryProps<IHistoryItem<T>>) {
    this.context = context;
    this.props = props;
    this.push();
    this.makeObservable();
  }

  public makeObservable() {
    define(this, {
      current: observable.ref,
      history: observable.shallow,
      push: action,
      undo: action,
      redo: action,
      goTo: action,
      clear: action,
    });
  }

  public list() {
    return this.history;
  }

  public push(type?: string) {
    if (this.locking) return;
    if (this.current < this.history.length - 1) {
      this.history = this.history.slice(0, this.current + 1);
    }
    const item = {
      data: this.context.serialize(),
      timestamp: Date.now(),
      type,
    };
    this.current = this.history.length;
    this.history.push(item);
    const overSizeCount = this.history.length - this.maxSize;
    if (overSizeCount > 0) {
      this.history.splice(0, overSizeCount);
      this.current = this.history.length - 1;
    }
    if (this.props?.onPush) {
      this.props.onPush(item);
    }
  }

  public get allowUndo() {
    return this.history.length > 0 && this.current - 1 >= 0;
  }

  public get allowRedo() {
    return this.history.length > this.current + 1;
  }

  public redo() {
    if (this.allowRedo) {
      const item = this.history[this.current + 1];
      this.locking = true;
      this.context.from(item.data);
      this.locking = false;
      this.current++;
      if (this.props?.onRedo) {
        this.props.onRedo(item);
      }
    }
  }

  public undo() {
    if (this.allowUndo) {
      const item = this.history[this.current - 1];
      this.locking = true;
      this.context.from(item.data);
      this.locking = false;
      this.current--;
      if (this.props?.onUndo) {
        this.props.onUndo(item);
      }
    }
  }

  public goTo(index: number) {
    const item = this.history[index];
    if (item) {
      this.locking = true;
      this.context.from(item.data);
      this.locking = false;
      this.current = index;
      if (this.props?.onGoto) {
        this.props.onGoto(item);
      }
    }
  }

  public clear() {
    this.history = [];
    this.current = 0;
  }
}
