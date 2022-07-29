import { Engine } from './Engine';
import { action, define, observable } from '@formily/reactive';

export enum ScreenType {
  PC = 'PC',
  Responsive = 'Responsive',
  Mobile = 'Mobile',
  Transform = 'Transform',
}

export enum ScreenStatus {
  Normal = 'Normal',
  Resizing = 'Resizing',
  Zooming = 'Zooming',
}

export class Screen {
  public type: ScreenType;
  public scale: number = 1;
  public width: number | string = '100%';
  public height: number | string = '100%';
  public engine: Engine;
  public background: string = '';
  public flip: boolean = false;
  public status: ScreenStatus = ScreenStatus.Normal;

  public constructor(engine: Engine) {
    this.engine = engine;
    this.type = engine.props.defaultScreenType;
    this.makeObservable();
  }

  public makeObservable() {
    define(this, {
      type: observable.ref,
      scale: observable.ref,
      width: observable.ref,
      height: observable.ref,
      status: observable.ref,
      flip: observable.ref,
      background: observable.ref,
      setType: action,
      setScale: action,
      setSize: action,
      resetSize: action,
      setBackground: action,
      setFlip: action,
    });
  }

  public setStatus(status: ScreenStatus) {
    this.status = status;
  }

  public setType(type: ScreenType) {
    this.type = type;
  }

  public setScale(scale: number) {
    this.scale = scale;
  }

  public setSize(width?: number | string, height?: number | string) {
    if (width) {
      this.width = width;
    }
    if (height) {
      this.height = height;
    }
  }

  public resetSize() {
    this.width = '100%';
    this.height = '100%';
  }

  public setBackground(background: string) {
    this.background = background;
  }

  public setFlip(flip: boolean) {
    this.flip = flip;
  }
}
