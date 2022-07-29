import { action, define, observable } from '@formily/reactive';
import { Engine } from './engine';
import { globalThisPolyfill, isValidNumber } from '@designer/utils';

export enum CursorStatus {
  Normal = 'NORMAL',
  DragStart = 'DRAG_START',
  Dragging = 'DRAGGING',
  DragStop = 'DRAG_STOP',
}

export enum CursorDragType {
  Move = 'MOVE',
  Resize = 'RESIZE',
  Rotate = 'ROTATE',
  Scale = 'SCALE',
  Translate = 'TRANSLATE',
  Round = 'ROUND',
}

export enum CursorType {
  Normal = 'NORMAL',
  Selection = 'SELECTION',
  Transform = 'TRANSFORM',
}

export interface ICursorPosition {
  pageX?: number;

  pageY?: number;

  clientX?: number;

  clientY?: number;

  topPageX?: number;

  topPageY?: number;

  topClientX?: number;

  topClientY?: number;
}

export interface ICursor {
  status?: CursorStatus;

  position?: ICursorPosition;

  dragStartPosition?: ICursorPosition;

  dragEndPosition?: ICursorPosition;

  view?: Window;
}

const DEFAULT_POSITION = {
  pageX: 0,
  pageY: 0,
  clientX: 0,
  clientY: 0,
  topPageX: 0,
  topPageY: 0,
  topClientX: 0,
  topClientY: 0,
};

const setCursorStyle = (contentWindow: Window, style: string) => {
  const currentRoot = document?.getElementsByTagName?.('html')?.[0];
  const root = contentWindow?.document?.getElementsByTagName('html')?.[0];
  if (root && root.style.cursor !== style) {
    root.style.cursor = style;
  }
  if (currentRoot && currentRoot.style.cursor !== style) {
    currentRoot.style.cursor = style;
  }
};

const calcPositionDelta = (end: ICursorPosition, start: ICursorPosition): ICursorPosition => {
  return Object.keys(end || {}).reduce((buf, key) => {
    if (isValidNumber(end?.[key]) && isValidNumber(start?.[key])) {
      buf[key] = end[key] - start[key];
    } else {
      buf[key] = end[key];
    }
    return buf;
  }, {});
};

export class Cursor {
  public engine: Engine;

  public type: CursorType | string = CursorType.Normal;

  public dragType: CursorDragType | string = CursorDragType.Move;

  public status: CursorStatus = CursorStatus.Normal;

  public position: ICursorPosition = DEFAULT_POSITION;

  public dragStartPosition: ICursorPosition;

  public dragEndPosition: ICursorPosition;

  public dragAtomDelta: ICursorPosition = DEFAULT_POSITION;

  public dragStartToCurrentDelta: ICursorPosition = DEFAULT_POSITION;

  public dragStartToEndDelta: ICursorPosition = DEFAULT_POSITION;

  public view: Window = globalThisPolyfill;

  public constructor(engine: Engine) {
    this.engine = engine;
  }

  public makeObservable() {
    define(this, {
      type: observable.ref,
      dragType: observable.ref,
      status: observable.ref,
      position: observable.ref,
      dragStartPosition: observable.ref,
      dragEndPosition: observable.ref,
      dragAtomDelta: observable.ref,
      dragStartToCurrentDelta: observable.ref,
      dragStartToEndDelta: observable.ref,
      view: observable.ref,
      // TODO
      // setStyle: action,
      setPosition: action,
      setStatus: action,
      setType: action,
    });
  }

  public setStatus(status: CursorStatus) {
    this.status = status;
  }

  public setType(type: CursorType | string) {
    this.type = type;
  }

  public setDragType(type: CursorDragType | string) {
    this.dragType = type;
  }

  // TODO
  /* public setStyle(style: string) {
    this.engine.workbench.eachWorkspace((workspace) => {
      setCursorStyle(workspace.viewport.contentWindow, style);
    });
  } */

  public setPosition(position?: ICursorPosition) {
    this.dragAtomDelta = calcPositionDelta(this.position, position);
    this.position = { ...position };
    if (this.status === CursorStatus.Dragging) {
      this.dragStartToCurrentDelta = calcPositionDelta(this.position, this.dragStartPosition);
    }
  }

  public setDragStartPosition(position: ICursorPosition) {
    if (position) {
      this.dragStartPosition = { ...position };
    } else {
      this.dragStartPosition = null;
      this.dragStartToCurrentDelta = DEFAULT_POSITION;
    }
  }

  public setDragEndPosition(position?: ICursorPosition) {
    if (!this.dragStartPosition) return;
    if (position) {
      this.dragEndPosition = { ...position };
      this.dragStartToEndDelta = calcPositionDelta(this.dragStartPosition, this.dragEndPosition);
    } else {
      this.dragEndPosition = null;
      this.dragStartToEndDelta = DEFAULT_POSITION;
    }
  }
}
