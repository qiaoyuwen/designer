import { identity, inverse, Matrix, compose, rotate, translate, decomposeTSR } from 'transformation-matrix';
import { Point, IPoint, Rect, RectLineTypes, LineSegment, IRectSize, RectSize } from './geometry';
import { computable, IComputeScheduler } from './computable';
import { PaintObserver } from './observer';
import { Vector, calcProjectionOfVector, calcCosOfVector, calcLengthOfVector } from './geometry';
import parseUnit from 'parse-unit';
import { calcScrollOffset } from './scroller';
import { debounceMicro } from './debounce';
import { precision } from './precision';

export class Position {
  public transformer: GeneralTransformer;
  public x: number;
  public y: number;
  public constructor(transformer: GeneralTransformer, position: IPoint) {
    this.transformer = transformer;
    this.x = position.x;
    this.y = position.y;
  }

  public get clientX() {
    return applyToPoint(this.transformer.clientMatrix, this).x;
  }

  public get clientY() {
    return applyToPoint(this.transformer.clientMatrix, this).y;
  }

  public get absoluteX() {
    return applyToPoint(this.transformer.absoluteMatrix, this).x;
  }

  public get absoluteY() {
    return applyToPoint(this.transformer.absoluteMatrix, this).y;
  }
}

export class HTMLParentStack {
  public element: HTMLElement;
  public scrollParents: (HTMLElement | Window)[] = [];
  public parentMatrix: Matrix;
  public constructor(element: HTMLElement) {
    const stack = calcStackInfo(element);
    this.element = element;
    this.scrollParents = stack.scrollParents;
    this.parentMatrix = stack.parentMatrix;
  }

  public get scrollOffset() {
    let x = 0,
      y = 0;
    for (let i = 0; i < this.scrollParents.length; i++) {
      const offset = calcScrollOffset(this.scrollParents[i]);
      x = x + offset.x;
      y = y + offset.y;
    }
    return { x, y };
  }
}

const PIXELS_PER_INCH = 96;

const TransformResolverSymbol = Symbol('TransformResolver');

const defaultUnits: Record<string, number> = {
  ch: 8,
  ex: 7.15625,
  em: 16,
  rem: 16,
  in: PIXELS_PER_INCH,
  cm: PIXELS_PER_INCH / 2.54,
  mm: PIXELS_PER_INCH / 25.4,
  pt: PIXELS_PER_INCH / 72,
  pc: PIXELS_PER_INCH / 6,
  px: 1,
};

function multiply(m1: Matrix, m2: Matrix) {
  return {
    a: m1.a * m2.a + m1.c * m2.b,
    c: m1.a * m2.c + m1.c * m2.d,
    e: m1.a * m2.e + m1.c * m2.f + m1.e,
    b: m1.b * m2.a + m1.d * m2.b,
    d: m1.b * m2.c + m1.d * m2.d,
    f: m1.b * m2.e + m1.d * m2.f + m1.f,
  };
}

function applyToPoint(matrix: Matrix, point: IPoint) {
  return {
    x: matrix.a * point.x + matrix.c * point.y + matrix.e,
    y: matrix.b * point.x + matrix.d * point.y + matrix.f,
  };
}

function calcRectPoints(transformer: ElementTransformer | ElementGroupTransformer) {
  return {
    lt: new Position(transformer, { x: 0, y: 0 }),
    rt: new Position(transformer, { x: transformer.width, y: 0 }),
    lb: new Position(transformer, { x: 0, y: transformer.height }),
    rb: new Position(transformer, {
      x: transformer.width,
      y: transformer.height,
    }),
    cc: new Position(transformer, {
      x: transformer.width / 2,
      y: transformer.height / 2,
    }),
    lc: new Position(transformer, { x: 0, y: transformer.height / 2 }),
    rc: new Position(transformer, {
      x: transformer.width,
      y: transformer.height / 2,
    }),
    ct: new Position(transformer, { x: transformer.width / 2, y: 0 }),
    cb: new Position(transformer, {
      x: transformer.width / 2,
      y: transformer.height,
    }),
  };
}

function moveToCSSOrigin(transformMatrix: Matrix, transformOrigin: IPoint) {
  return multiply(
    translate(-transformOrigin.x, -transformOrigin.y),
    multiply(transformMatrix, translate(transformOrigin.x, transformOrigin.y)),
  );
}

function moveToStandardOrigin(transformMatrix: Matrix, transformOrigin: IPoint) {
  return multiply(
    translate(transformOrigin.x, transformOrigin.y),
    multiply(transformMatrix, translate(-transformOrigin.x, -transformOrigin.y)),
  );
}

function calcStyledMatrix(
  element: HTMLElement,
  width: number = element?.offsetWidth,
  height: number = element?.offsetHeight,
) {
  const parse = () => {
    if (!element) return identity();
    const transform = getComputedStyle(element).transform;
    if (!transform || transform === 'none') return identity();
    const parsed = transform
      .match(/matrix?\(([^)]+)\)/)?.[1]
      ?.split(',')
      .map(parseFloat);
    if (parsed && parsed.length === 6)
      return {
        a: parsed[0],
        b: parsed[1],
        c: parsed[2],
        d: parsed[3],
        e: parsed[4],
        f: parsed[5],
      };
    return identity();
  };
  return moveToStandardOrigin(parse(), calcStyledOrigin(element, width, height));
}

function calcStyledOrigin(
  element: HTMLElement,
  width: number = element?.offsetWidth,
  height: number = element?.offsetHeight,
) {
  const transformOrigin = element?.style?.transformOrigin || 'center';
  const origin = transformOrigin.trim();
  if (!origin) return new Point(0, 0);
  const splits = origin.split(/\s+/);
  const x = width / 2,
    y = height / 2;
  const toPx = (value: string, axis: 'x' | 'y') => {
    const defaultValue = axis === 'x' ? x : y;
    if (!value) return defaultValue;
    const parts = parseUnit(value);
    if (!isNaN(parts[0])) {
      if (parts[1]) {
        if (parts[1] === '%') {
          return axis === 'x' ? width * 0.001 * parts[0] : height * 0.001 * parts[0];
        }
        const px = defaultUnits[parts[1]];
        return typeof px === 'number' ? parts[0] * px : defaultValue;
      } else {
        return parts[0];
      }
    }
    return defaultValue;
  };
  const createPoint = (x: number, y: number) => {
    return new Point(x, y);
  };
  if (splits.length === 1) {
    switch (splits[0]) {
      case 'bottom':
        return createPoint(x, height);
      case 'absolute':
        return createPoint(x, 0);
      case 'left':
        return createPoint(0, y);
      case 'right':
        return createPoint(width, y);
    }
  } else if (splits.length > 1) {
    if (splits[0] === 'bottom') {
      if (splits[1] === 'left') {
        return createPoint(0, height);
      }
      if (splits[1] === 'right') {
        return createPoint(width, height);
      }
      return createPoint(x, y);
    }
    if (splits[0] === 'absolute') {
      if (splits[1] === 'left') {
        return createPoint(0, 0);
      }
      if (splits[1] === 'right') {
        return createPoint(width, 0);
      }
      return createPoint(x, y);
    }
    if (splits[0] === 'left') {
      if (splits[1] === 'absolute') {
        return createPoint(0, 0);
      }
      if (splits[1] === 'bottom') {
        return createPoint(0, height);
      }
      return createPoint(0, toPx(splits[1], 'y'));
    }
    if (splits[0] === 'right') {
      if (splits[1] === 'absolute') {
        return createPoint(width, 0);
      }
      if (splits[1] === 'bottom') {
        return createPoint(width, height);
      }
      return createPoint(width, toPx(splits[1], 'y'));
    }
    return createPoint(toPx(splits[0], 'x'), toPx(splits[1], 'y'));
  }
  return createPoint(x, y);
}

function calcStackInfo(element: HTMLElement) {
  let parentMatrix = identity();
  const scrollParents: (HTMLElement | Window)[] = [window];
  const visitor = (element: HTMLElement, child: HTMLElement) => {
    if (!element) return;
    const frameView = element.ownerDocument?.defaultView;
    if (element === child.offsetParent) {
      parentMatrix = multiply(
        multiply(translate(element.offsetLeft, element.offsetTop), calcStyledMatrix(element)),
        parentMatrix,
      );
    }
    const style = getComputedStyle(element);
    if (element.scrollHeight > element.clientHeight || (style.overflow !== 'visible' && style.overflow !== 'hidden')) {
      scrollParents.push(element);
    }
    if (frameView && (!element.parentElement || element === frameView?.document?.body)) {
      scrollParents.push(frameView);
      visitor(frameView.frameElement as HTMLElement, element);
    } else {
      visitor(element.parentElement, element);
    }
  };
  visitor(element?.parentElement, element);
  return {
    parentMatrix,
    scrollParents,
  };
}

function calcGroupStyledPoints(transformers: ElementTransformer[]): Record<PointTypes, IPosition> {
  const rect = calcGroupStyledRect(transformers);
  const cc = calcGroupPosition(rect.width / 2, rect.height / 2, rect.center.x, rect.center.y);
  const ct = calcGroupPosition(rect.width / 2, 0, rect.center.x, rect.y);
  const cb = calcGroupPosition(rect.width / 2, rect.height, rect.center.x, rect.bottom);
  const lt = calcGroupPosition(0, 0, rect.left, rect.top);
  const lc = calcGroupPosition(0, rect.height / 2, rect.left, rect.center.y);
  const lb = calcGroupPosition(0, rect.height, rect.left, rect.bottom);
  const rt = calcGroupPosition(rect.width, 0, rect.right, rect.top);
  const rc = calcGroupPosition(rect.width, rect.height / 2, rect.right, rect.center.y);
  const rb = calcGroupPosition(rect.width, rect.height, rect.right, rect.bottom);
  return {
    cc,
    ct,
    cb,
    lt,
    lb,
    lc,
    rt,
    rc,
    rb,
  };
}

function calcGroupStyledRect(transformers: ElementTransformer[]) {
  let minX = Infinity,
    minY = Infinity,
    maxX = -Infinity,
    maxY = -Infinity;
  for (let index = 0; index < transformers.length; index++) {
    const transformer = transformers[index];
    const rect = transformer.element?.getBoundingClientRect();
    if (rect) {
      minX = Math.min(minX, rect.left);
      minY = Math.min(minY, rect.top);
      maxX = Math.max(maxX, rect.right);
      maxY = Math.max(maxY, rect.bottom);
    }
  }
  return new Rect(minX, minY, maxX - minX, maxY - minY);
}

function calcGroupRelations(
  transformers: ElementTransformer[],
  startPoints: Record<PointTypes, IPosition>,
  startWidth: number,
  startHeight: number,
): GroupRelations {
  const relatives: GroupRelations = new Map();
  transformers.forEach((transformer) => {
    relatives.set(transformer, {
      offsetsOfGroupToElement: Object.entries(startPoints).reduce((buf, [type, value]) => {
        buf[type] = transformer.getRelativePosition(value);
        return buf;
      }, {}) as any,
      styledOffsetOfElement: {
        x: transformer.element?.offsetLeft || 0,
        y: transformer.element?.offsetTop || 0,
      },
      ratioOfElementSizeToGroup: {
        width: transformer.element?.offsetWidth / startWidth,
        height: transformer.element?.offsetHeight / startHeight,
      },
      absolutePointOfElementOrigin: {
        x: transformer.points.lt.absoluteX,
        y: transformer.points.lt.absoluteY,
      },
      ratioOfElementOriginToGroupOrigin: {
        x: (transformer.points.lt.clientX - startPoints.lt.clientX) / startWidth,
        y: (transformer.points.lt.clientY - startPoints.lt.clientY) / startHeight,
      },
    });
  });
  return relatives;
}

function calcGroupPosition(x: number, y: number, clientX: number, clientY: number) {
  return {
    x,
    y,
    clientX,
    clientY,
  };
}

function calcResizeFactors(direction: PointTypes): IResizeFactors {
  switch (direction) {
    case 'cb':
      return {
        width: 0,
        height: -1,
        point: 'cb',
        line: 'hb',
      };
    case 'ct':
      return {
        width: 0,
        height: 1,
        point: 'ct',
        line: 'ht',
      };
    case 'lb':
      return {
        width: 1,
        height: -1,
        point: 'lb',
        line: 'vl',
      };
    case 'lc':
      return {
        width: 1,
        height: 0,
        point: 'lc',
        line: 'vl',
      };
    case 'lt':
      return {
        width: 1,
        height: 1,
        point: 'lt',
        line: 'vl',
      };
    case 'rb':
      return {
        width: -1,
        height: -1,
        point: 'rb',
        line: 'vr',
      };
    case 'rt':
      return {
        width: -1,
        height: 1,
        point: 'rt',
        line: 'vr',
      };
    case 'rc':
      return {
        width: -1,
        height: 0,
        point: 'rc',
        line: 'vr',
      };
  }
}

function calcResizeFixedType(direction: PointTypes, symmetry?: boolean): PointTypes {
  if (symmetry) return 'cc';
  switch (direction) {
    case 'cb':
      return 'ct';
    case 'ct':
      return 'cb';
    case 'lt':
      return 'rb';
    case 'lc':
      return 'rc';
    case 'lb':
      return 'rt';
    case 'rt':
      return 'lb';
    case 'rb':
      return 'lt';
    case 'rc':
      return 'lc';
  }
}

function calcGroupParent(transformers: ElementTransformer[] = []) {
  let parent = transformers[0]?.element?.parentElement;
  transformers.forEach((t) => {
    const currentParent = t.element?.parentElement;
    if (currentParent?.contains(parent)) {
      parent = currentParent;
    }
  });
  return parent;
}

function calcMatrixRotation(matrix: Matrix) {
  return decomposeTSR(matrix)?.rotation?.angle ?? 0;
}

function createTransformRequest(props: ITransformRequestProps) {
  const { startWidth, startHeight, startRotation, maxTranslate, origin, snapper } = props ?? {};
  return {
    resize: (deltaX: number, deltaY: number, options: ITransformerResizeOptions) => {
      const { direction, keepAspectRatio, fixed, control } = options ?? {};
      const factors = calcResizeFactors(direction);
      const startFixed = fixed;
      const startControl = control;
      const fixedRatioX = startFixed.x / startWidth;
      const fixedRatioY = startFixed.y / startHeight;
      const trackRatioX = Math.abs(startControl.x - startFixed.x) / startWidth;
      const trackRatioY = Math.abs(startControl.y - startFixed.y) / startHeight;
      const calcRatioDelta = (delta: number, ratio: number) => {
        ratio = precision(ratio);
        return 1 - ratio ? delta / Math.abs(1 - ratio) : delta;
      };
      const calcFixedOffset = (distWidth: number, distHeight: number) => {
        return {
          x: fixedRatioX * startWidth - fixedRatioX * distWidth,
          y: fixedRatioY * startHeight - fixedRatioY * distHeight,
        };
      };
      const createResult = (size: IRectSize) => {
        size = snapper?.getResizeSnapSize?.(size.width, size.height) ?? size;
        return [size.width, size.height, calcFixedOffset(size.width, size.height)];
      };
      const rotatedDelta = applyToPoint(rotate(-startRotation), new Point(deltaX, deltaY));
      const resizeDeltaX = calcRatioDelta(rotatedDelta.x, trackRatioX);
      const resizeDeltaY = calcRatioDelta(rotatedDelta.y, trackRatioY);
      const cursorVector = new Point(resizeDeltaX, resizeDeltaY);
      const trackVector = new Vector(new LineSegment(startFixed, control));
      const trackProjection = calcProjectionOfVector(cursorVector, trackVector);
      if (keepAspectRatio) {
        const ratio = startWidth / startHeight;
        const xVector = new Point(startWidth, 0);
        const yVector = new Point(0, startHeight);
        const xProjection = calcProjectionOfVector(trackProjection, xVector);
        const yProjection = calcProjectionOfVector(trackProjection, yVector);
        const pDeltaX = xProjection.x;
        const pDeltaY = yProjection.y;
        if (Math.abs(pDeltaX) > Math.abs(pDeltaY)) {
          const distWidth = Math.max(startWidth - pDeltaX * factors.width, 0);
          const distHeight = distWidth / ratio;
          return createResult(new RectSize(distWidth, distHeight));
        } else {
          const distHeight = Math.max(startHeight - pDeltaY * factors.height, 0);
          const distWidth = distHeight * ratio;
          return createResult(new RectSize(distWidth, distHeight));
        }
      }
      const distWidth = Math.max(startWidth - resizeDeltaX * factors.width, 0);
      const distHeight = Math.max(startHeight - resizeDeltaY * factors.height, 0);
      return createResult(new RectSize(distWidth, distHeight));
    },
    translate: (deltaX: number, deltaY: number, options?: ITransformTranslateOptions) => {
      const { restricting } = options ?? {};
      const createResult = (offset: IPoint) => {
        offset = snapper?.getTranslateSnapOffset?.(offset.x, offset.y) ?? offset;
        return [offset.x, offset.y];
      };
      if (restricting) {
        maxTranslate.x = Math.max(Math.abs(deltaX), maxTranslate.x);
        maxTranslate.y = Math.max(Math.abs(deltaY), maxTranslate.y);
        if (Math.abs(maxTranslate.x) > Math.abs(maxTranslate.y)) {
          return createResult(new Point(deltaX, 0));
        } else {
          return createResult(new Point(0, deltaY));
        }
      } else {
        return createResult(new Point(deltaX, deltaY));
      }
    },
    rotate: (cursorX: number, cursorY: number, options?: ITransformRotateOptions) => {
      const { restricting } = options ?? {};
      const angle = Math.atan2(cursorY - origin.clientY, cursorX - origin.clientX) + Math.PI / 2;
      const createResult = (angle: number) => {
        angle = snapper?.getRotateSnapAngle?.(angle) ?? angle;
        return [angle];
      };
      if (restricting) {
        const degree = (angle * 180) / Math.PI;
        const targetDegree = Math.round(degree / 15) * 15;
        return createResult((targetDegree * Math.PI) / 180 - startRotation);
      }
      return createResult(angle - startRotation);
    },
  };
}

export interface ITransformerResizeOptions {
  keepAspectRatio?: boolean;
  symmetry?: boolean;
  direction: PointTypes;
  fixed?: IPosition;
  control?: IPosition;
}

export interface ITransformTranslateOptions {
  restricting?: boolean;
}

export interface ITransformRotateOptions {
  restricting?: boolean;
}

export interface ITransformRequestProps {
  startWidth: number;
  startHeight: number;
  startRotation: number;
  maxTranslate: IPoint;
  origin: IPosition;
  snapper?: ITransformSnapper;
}

export interface ITransformResolver {
  resize: (width: number, height: number, offset: IPoint) => void;
  translate: (tx: number, ty?: number) => void;
  rotate: (rotation: number, origin?: IPoint) => void;
  push: (matrix: Matrix) => void;
}

export type ITransformRequest = ReturnType<typeof createTransformRequest>;

export type ITransformApplier = {
  [key in keyof ITransformRequest]: (...args: Parameters<ITransformRequest[key]>) => void;
} & {
  resolver: ITransformResolver;
};

export interface ITransformSnapper {
  getTranslateSnapOffset?: (x: number, y: number) => IPoint;
  getResizeSnapSize?: (width: number, height: number) => IRectSize;
  getRotateSnapAngle?: (rotation: number) => number;
}
export interface IPosition {
  x: number;
  y: number;
  clientX: number;
  clientY: number;
}

export interface IElementNode {
  id: string;
  getElement(): HTMLElement;
}

export type TransformSubscriber = (transformer: ElementTransformer) => void;

export type VertexTypes = 'lt' | 'rt' | 'rb' | 'lb' | (string & {});

export type CenterTypes = 'lc' | 'rc' | 'cc' | 'ct' | 'cb' | (string & {});

export type PointTypes = VertexTypes | CenterTypes;

export type GeneralTransformer = ElementTransformer | ElementGroupTransformer;

export interface IResizeFactors {
  width: number;
  height: number;
  point: PointTypes;
  line: RectLineTypes;
}

export type HTMLParentStackFeature = Record<'scrollParent' | 'offsetParent', boolean>;

export interface IGroupRelativeItem {
  offsetsOfGroupToElement: Record<PointTypes, IPoint>;
  absolutePointOfElementOrigin: IPoint;
  styledOffsetOfElement: IPoint;
  ratioOfElementOriginToGroupOrigin: IPoint;
  ratioOfElementSizeToGroup: { width: number; height: number };
}

export type GroupRelations = Map<ElementTransformer, IGroupRelativeItem>;

export class ElementTransformer {
  public element: HTMLElement;
  public matrix: Matrix;
  public width: number;
  public height: number;
  private _matrix: Matrix;
  private _stack: HTMLParentStack;
  private _scheduler: IComputeScheduler;
  private _observer: PaintObserver;
  private _startWidth: number;
  private _startHeight: number;
  private _startRotation: number;
  private _startPoints: Record<PointTypes, IPosition>;
  private _maxTranslate: IPoint = new Point(0, 0);
  private _subscribers: Set<TransformSubscriber> = new Set();
  public constructor(element: HTMLElement) {
    this.element = element;
    this.width = this.offsetWidth;
    this.height = this.offsetHeight;
    this.matrix = this.styledMatrix;
    this._matrix = this.matrix;
    this._startWidth = this.width;
    this._startHeight = this.height;
    this._startPoints = this.points;
    this._startRotation = calcMatrixRotation(this.matrix);
    this._scheduler = computable(this, [
      'styledMatrix',
      'styledOrigin',
      'boundingClientRect',
      'offsetWidth',
      'offsetHeight',
      'points',
      'vertexes',
      'clientMatrix',
    ]);
    this._stack = new HTMLParentStack(element);
  }

  public get decomposeMatrix() {
    return decomposeTSR(this.matrix);
  }

  public get offsetWidth() {
    return this.element?.offsetWidth ?? 0;
  }

  public get offsetHeight() {
    return this.element?.offsetHeight ?? 0;
  }

  public get boundingClientRect() {
    let minX = Infinity,
      minY = Infinity,
      maxX = -Infinity,
      maxY = -Infinity;
    const vertexes = this.vertexes;
    for (let i = 0; i < vertexes.length; i++) {
      const p = vertexes[i];
      if (p.clientX < minX) {
        minX = p.clientX;
      }
      if (p.clientX > maxX) {
        maxX = p.clientX;
      }
      if (p.clientY < minY) {
        minY = p.clientY;
      }
      if (p.clientY > maxY) {
        maxY = p.clientY;
      }
    }
    return new Rect(precision(minX), precision(minY), precision(maxX - minX), precision(maxY - minY));
  }

  public get rotation() {
    return calcMatrixRotation(this.matrix);
  }

  public get originPosition() {
    return this.points.cc;
  }

  public get styledMatrix() {
    return calcStyledMatrix(this.element, this.width, this.height);
  }

  public get styledOrigin() {
    return calcStyledOrigin(this.element, this.width, this.height);
  }

  public get cssMatrix() {
    return moveToCSSOrigin(this.matrix, this.styledOrigin);
  }

  public get scrollOffset() {
    return this._stack.scrollOffset;
  }

  public get clientMatrix() {
    const parentMatrix = this._stack.parentMatrix;
    const scrollOffset = this.scrollOffset;
    return multiply(
      parentMatrix,
      multiply(
        translate(this.element?.offsetLeft - scrollOffset.x, this.element?.offsetTop - scrollOffset.y),
        this.matrix,
      ),
    );
  }

  public get absoluteMatrix() {
    const parentMatrix = this._stack.parentMatrix;
    return multiply(parentMatrix, multiply(translate(this.element?.offsetLeft, this.element?.offsetTop), this.matrix));
  }

  public get cssClientMatrix() {
    return moveToCSSOrigin(this.clientMatrix, this.styledOrigin);
  }

  public get cssAbsoluteMatrix() {
    return moveToCSSOrigin(this.absoluteMatrix, this.styledOrigin);
  }

  public get points() {
    return calcRectPoints(this);
  }

  public get vertexes() {
    const points = this.points;
    return [points.lt, points.rt, points.rb, points.lb];
  }

  public transform(effect: (applier: ITransformApplier) => void, snapper?: ITransformSnapper) {
    if (typeof effect !== 'function') return () => {};
    this._scheduler.start();
    const matrixes: Matrix[] = [this._matrix];
    const distSize = { width: this.width, height: this.height };
    const styledOrigin = this.styledOrigin;
    const request = createTransformRequest({
      startWidth: this._startWidth,
      startHeight: this._startHeight,
      startRotation: this._startRotation,
      maxTranslate: this._maxTranslate,
      origin: this.originPosition,
      snapper,
    });
    const resolver: ITransformResolver = {
      resize: (width: number, height: number, offset: IPoint) => {
        if (offset) {
          matrixes.push(translate(offset.x, offset.y));
        }
        if (width < 0 || height < 0) {
          return;
        }
        distSize.width = width;
        distSize.height = height;
      },
      rotate: (rotation: number, origin = styledOrigin) => {
        matrixes.push(rotate(rotation, origin.x, origin.y));
      },
      translate: (tx: number, ty = 0) => {
        matrixes.push(inverse(this.absoluteMatrix), translate(tx, ty), this.absoluteMatrix);
      },
      push(matrix: Matrix) {
        matrixes.push(matrix);
      },
    };
    const applier: ITransformApplier = {
      resize: (deltaX, deltaY, options) => {
        const fixedType = calcResizeFixedType(options?.direction, options?.symmetry);
        const controlType = options?.direction;
        resolver.resize.apply(
          this,
          request.resize(deltaX, deltaY, {
            fixed: this._startPoints[fixedType],
            control: this._startPoints[controlType],
            ...options,
          }),
        );
      },
      translate: (deltaX, deltaY, options) => {
        resolver.translate.apply(this, request.translate(deltaX, deltaY, options));
      },
      rotate: (cursorX, cursorY, options) => {
        resolver.rotate.apply(this, request.rotate(cursorX, cursorY, options));
      },
      resolver,
    };
    applier[TransformResolverSymbol] = resolver;
    effect(applier);
    this.width = distSize.width;
    this.height = distSize.height;
    this.matrix = compose(matrixes);
    this._scheduler.end();
    return () => {
      return transformElement(this.element, this.width, this.height, this.cssMatrix);
    };
  }

  public getRelativePosition(position: IPosition) {
    const points = this.points;
    const ltPoint = new Point(points.lt.clientX, points.lt.clientY);
    const lbPoint = new Point(points.lb.clientX, points.lb.clientY);
    const rtPoint = new Point(points.rt.clientX, points.rt.clientY);
    const point = new Point(position.clientX, position.clientY);
    const xProjection = calcProjectionOfVector(
      new Vector({
        start: ltPoint,
        end: point,
      }),
      new Vector({
        start: ltPoint,
        end: rtPoint,
      }),
    );
    const cos1 = calcCosOfVector(
      new Vector({
        start: ltPoint,
        end: point,
      }),
      new Vector({
        start: ltPoint,
        end: rtPoint,
      }),
    );
    const yProjection = calcProjectionOfVector(
      new Vector({
        start: ltPoint,
        end: point,
      }),
      new Vector({
        start: ltPoint,
        end: lbPoint,
      }),
    );
    const cos2 = calcCosOfVector(
      new Vector({
        start: ltPoint,
        end: point,
      }),
      new Vector({
        start: ltPoint,
        end: lbPoint,
      }),
    );
    return new Point(
      Math.round(calcLengthOfVector(xProjection) * (cos1 > 0 ? 1 : -1)),
      Math.round(calcLengthOfVector(yProjection) * (cos2 > 0 ? 1 : -1)),
    );
  }

  public subscribe = (subscriber: TransformSubscriber) => {
    const handler = this._scheduler.bound(subscriber);
    this._subscribers.add(handler);
    if (this._subscribers.size === 1) {
      this._observer = new PaintObserver(() => {
        this._subscribers.forEach((fn) => fn(this));
      });
      this._observer.observe(this.element);
    }
    return () => {
      this._subscribers.delete(handler);
      if (this._subscribers.size === 0) {
        this._observer.disconnect();
      }
    };
  };

  public track = () => {
    this._startWidth = this.width;
    this._startHeight = this.height;
    this._startPoints = this.points;
    this._startRotation = calcMatrixRotation(this.matrix);
    this._matrix = this.matrix;
  };
}

export class ElementGroupTransformer {
  public matrix: Matrix;
  public width: number;
  public height: number;
  public offsetWidth: number;
  public offsetHeight: number;
  private _matrix: Matrix;
  private _startWidth: number;
  private _startHeight: number;
  private _startOffsetLeft: number;
  private _startOffsetTop: number;
  private _maxTranslate: IPoint = new Point(0, 0);
  private _startPoints: Record<PointTypes, IPosition>;
  private _startRelations: GroupRelations;
  private _transformers: ElementTransformer[] = [];
  private _stack: HTMLParentStack;
  private _scheduler: IComputeScheduler;
  public constructor(elements: HTMLElement[]) {
    this._transformers = elements.map((element) => new ElementTransformer(element));
    const startClientRect = this.boundingClientRect;
    this.offsetWidth = startClientRect.width;
    this.offsetHeight = startClientRect.height;
    this._startWidth = this.offsetWidth;
    this._startHeight = this.offsetHeight;
    this._matrix = this.styledMatrix;
    this.width = this.offsetWidth;
    this.height = this.offsetHeight;
    this.matrix = this._matrix;
    this._startPoints = calcGroupStyledPoints(this._transformers);
    this._startRelations = calcGroupRelations(
      this._transformers,
      this._startPoints,
      this._startWidth,
      this._startHeight,
    );
    this._stack = new HTMLParentStack(calcGroupParent(this._transformers));
    this._startOffsetLeft = startClientRect.x + this.scrollOffset.x;
    this._startOffsetTop = startClientRect.y + this.scrollOffset.y;
    this._scheduler = computable(this, [
      'styledMatrix',
      'styledOrigin',
      'boundingClientRect',
      'offsetWidth',
      'offsetHeight',
      'points',
      'vertexes',
      'clientMatrix',
    ]);
  }

  public get decomposeMatrix() {
    return decomposeTSR(this.matrix);
  }

  public get styledMatrix() {
    return identity();
  }

  public get styledOrigin() {
    return new Point(this.width / 2, this.height / 2);
  }

  public get rotation() {
    return calcMatrixRotation(this.matrix);
  }

  public get originPosition() {
    return new Position(this, this.styledOrigin);
  }

  public get boundingClientRect() {
    let minX = Infinity,
      minY = Infinity,
      maxX = -Infinity,
      maxY = -Infinity;
    for (let index = 0; index < this._transformers.length; index++) {
      const transformer = this._transformers[index];
      const vertexes = transformer.vertexes;
      for (let i = 0; i < vertexes.length; i++) {
        const p = vertexes[i];
        if (p.clientX < minX) {
          minX = p.clientX;
        }
        if (p.clientX > maxX) {
          maxX = p.clientX;
        }
        if (p.clientY < minY) {
          minY = p.clientY;
        }
        if (p.clientY > maxY) {
          maxY = p.clientY;
        }
      }
    }
    return new Rect(precision(minX), precision(minY), precision(maxX - minX), precision(maxY - minY));
  }

  public get scrollOffset() {
    return this._stack.scrollOffset;
  }

  public get startRotation() {
    return calcMatrixRotation(this._matrix);
  }

  public get clientMatrix() {
    const scrollOffset = this.scrollOffset;
    return multiply(
      translate(this._startOffsetLeft - scrollOffset.x, this._startOffsetTop - scrollOffset.y),
      this.matrix,
    );
  }

  public get absoluteMatrix() {
    return multiply(translate(this._startOffsetLeft, this._startOffsetTop), this.matrix);
  }

  public get cssMatrix() {
    return moveToCSSOrigin(this.matrix, this.styledOrigin);
  }

  public get cssClientMatrix() {
    return moveToCSSOrigin(this.clientMatrix, this.styledOrigin);
  }

  public get cssAbsoluteMatrix() {
    return moveToCSSOrigin(this.absoluteMatrix, this.styledOrigin);
  }

  public get points() {
    return calcRectPoints(this);
  }

  public get vertexes() {
    const points = this.points;
    return [points.lt, points.rt, points.rb, points.lb];
  }

  public transform = (transformer: (transformer: ITransformApplier) => void, snapper?: ITransformSnapper) => {
    if (typeof transformer !== 'function') return () => {};
    this._scheduler.start();
    const patches: (() => void)[] = [];
    const matrixes: Matrix[] = [this._matrix];
    const distSize = { width: this.width, height: this.height };

    const batchTransform = (callback: (transformer: ITransformResolver, origin: IPoint) => void) => {
      this._transformers.forEach((transformer) => {
        patches.push(
          transformer.transform((t) =>
            callback(t[TransformResolverSymbol], this._startRelations.get(transformer)?.offsetsOfGroupToElement?.cc),
          ),
        );
      });
    };

    const resolver: ITransformResolver = {
      resize: (width: number, height: number, offset: IPoint) => {
        if (offset) {
          matrixes.push(translate(offset.x, offset.y));
        }
        if (width < 0 || height < 0) {
          return;
        }
        distSize.width = width;
        distSize.height = height;
      },
      rotate: (rotation: number, origin = this.styledOrigin) => {
        matrixes.push(rotate(rotation, origin.x, origin.y));
      },
      translate: (tx: number, ty = 0) => {
        matrixes.push(inverse(this.absoluteMatrix), translate(tx, ty), this.absoluteMatrix);
      },
      push(matrix: Matrix) {
        matrixes.push(matrix);
      },
    };

    const request = createTransformRequest({
      startWidth: this._startWidth,
      startHeight: this._startHeight,
      startRotation: this.startRotation,
      maxTranslate: this._maxTranslate,
      origin: this.originPosition,
      snapper,
    });

    const applier: ITransformApplier = {
      resize: (deltaX, deltaY, options) => {
        const fixedType = calcResizeFixedType(options?.direction, options?.symmetry);
        const controlType = options?.direction;
        resolver.resize.apply(
          this,
          request.resize(deltaX, deltaY, {
            ...options,
            fixed: this._startPoints[fixedType],
            control: this._startPoints[controlType],
            keepAspectRatio: true,
          }),
        );
        this._transformers.forEach((transformer) => {
          const {
            ratioOfElementSizeToGroup,
            ratioOfElementOriginToGroupOrigin,
            absolutePointOfElementOrigin,
            styledOffsetOfElement,
          } = this._startRelations.get(transformer) ?? {};
          patches.push(
            transformer.transform((t) => {
              const groupLTPoint = this.points.lt;
              const startRotation = transformer['startRotation_'];
              const elementCurrentOriginOffset = new Point(
                ratioOfElementOriginToGroupOrigin.x * distSize.width,
                ratioOfElementOriginToGroupOrigin.y * distSize.height,
              );
              const elementCurrentOriginPoint = new Point(
                groupLTPoint.absoluteX + elementCurrentOriginOffset.x,
                groupLTPoint.absoluteY + elementCurrentOriginOffset.y,
              );

              const elementStyledOffsetPoint = new Point(
                transformer.element.offsetLeft - styledOffsetOfElement.x,
                transformer.element.offsetTop - styledOffsetOfElement.y,
              );

              const elementDistWidth = ratioOfElementSizeToGroup.width * distSize.width;
              const elementDistHeight = ratioOfElementSizeToGroup.height * distSize.height;

              t.resolver.resize(
                elementDistWidth,
                elementDistHeight,
                applyToPoint(
                  rotate(-startRotation),
                  new Point(
                    elementCurrentOriginPoint.x - absolutePointOfElementOrigin.x - elementStyledOffsetPoint.x,
                    elementCurrentOriginPoint.y - absolutePointOfElementOrigin.y - elementStyledOffsetPoint.y,
                  ),
                ),
              );
            }),
          );
        });
      },
      translate: (deltaX, deltaY, options) => {
        const params = request.translate(deltaX, deltaY, options);
        batchTransform((t) => t.translate.apply(this, params));
        resolver.translate.apply(this, params);
      },
      rotate: (cursorX, cursorY, options) => {
        const params = request.rotate(cursorX, cursorY, options);
        batchTransform((t, origin) => t.rotate(params[0], origin));
        resolver.rotate.apply(this, params);
      },
      resolver,
    };

    transformer(applier);
    this.width = distSize.width;
    this.height = distSize.height;
    this.matrix = compose(matrixes);
    this._scheduler.end();
    return () => {
      patches.forEach((fn) => fn());
    };
  };

  public subscribe = (subscriber: TransformSubscriber) => {
    const handler = this._scheduler.bound(debounceMicro(subscriber));
    const disposers = this._transformers.map((transformer) => transformer.subscribe(handler));
    return () => disposers.forEach((fn) => fn());
  };

  public track = () => {
    this._matrix = this.matrix;
    this._startWidth = this.width;
    this._startHeight = this.height;
    this.offsetWidth = this.width;
    this.offsetHeight = this.height;
    this._startPoints = this.points;
    this._startRelations = calcGroupRelations(
      this._transformers,
      this._startPoints,
      this._startWidth,
      this._startHeight,
    );
    this._transformers.forEach((t) => t.track());
  };
}

const TransformerCache: {
  elements: HTMLElement[];
  transformer: GeneralTransformer;
} = {
  elements: [],
  transformer: null,
};

const isEqualElements = (els1: HTMLElement[], els2: HTMLElement[]) => {
  if (els1?.length !== els2?.length) return false;
  for (let i = 0; i < els1.length; i++) {
    if (els1[i] !== els2[i]) return false;
  }
  return true;
};

export function createElementTransformer<Node extends IElementNode>(nodes: Node[] = []) {
  const elements: HTMLElement[] = [];
  nodes.forEach((node) => {
    const element = node.getElement();
    const hasParent = elements.length > 0 && elements.some((target) => target !== element && target.contains(element));
    if (!hasParent) {
      elements.push(element);
    }
  });
  if (!isEqualElements(elements, TransformerCache.elements)) {
    TransformerCache.elements = elements;
    TransformerCache.transformer =
      elements.length > 1 ? new ElementGroupTransformer(elements) : new ElementTransformer(elements[0]);
  } else {
    TransformerCache.transformer?.track?.();
  }

  return TransformerCache.transformer;
}

export function transformElement(
  element: HTMLElement,
  width: number,
  height: number,
  matrix: Matrix,
  offsetX: number = 0,
  offsetY: number = 0,
) {
  const target = element;
  if (!target) return;
  const style = getComputedStyle(target);
  const boxSizing = style.boxSizing;
  if (target.style.display === 'none') {
    target.style.display = '';
  }
  if (boxSizing === 'border-box') {
    target.style.width = `${width}px`;
    target.style.height = `${height}px`;
  } else if (boxSizing === 'content-box') {
    target.style.width = `${
      width -
      parseFloat(style.paddingLeft) -
      parseFloat(style.paddingRight) -
      parseFloat(style.borderLeftWidth) -
      parseFloat(style.borderRightWidth)
    }px`;
    target.style.height = `${
      height -
      parseFloat(style.paddingTop) -
      parseFloat(style.paddingBottom) -
      parseFloat(style.borderTopWidth) -
      parseFloat(style.borderBottomWidth)
    }px`;
  }
  const decompose = decomposeTSR(matrix);
  const { translate: t, rotation: r, scale: s } = decompose;
  const rotation = `${(r.angle * 180) / Math.PI}deg`;
  target.style.transform = `translate3d(${t.tx + offsetX}px,${t.ty + offsetY}px,0) scale(${s.sx},${
    s.sy
  }) rotate(${rotation})`;
  target.style.setProperty('--rotation-angle', rotation);
  return decompose;
}
