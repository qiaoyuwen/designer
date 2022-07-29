import { calcRectOfAxisLineSegment, ILineSegment, IPoint, Rect } from '@designer/utils';
import { TransformHelper } from './TransformHelper';

export type ISnapLineType = 'ruler' | 'space-block' | 'normal';

export type ISnapLine = ILineSegment & {
  type?: ISnapLineType;
  distance?: number;
  offset?: number;
  edge?: string;
  id?: string;
};

export class SnapLine {
  private _id: string;
  public type: ISnapLineType;
  public distance: number;
  public offset: number;
  public start: IPoint;
  public edge: string;
  public end: IPoint;
  public helper: TransformHelper;
  public constructor(helper: TransformHelper, line: ISnapLine) {
    this.helper = helper;
    this.type = line.type || 'normal';
    this._id = line.id;
    this.start = { ...line.start };
    this.end = { ...line.end };
    this.edge = line.edge;
    this.offset = line.offset;
    this.distance = line.distance;
  }

  public get id() {
    return this._id ?? `${this.start.x}-${this.start.y}-${this.end.x}-${this.end.y}`;
  }

  public get direction() {
    if (this.start?.x === this.end?.x) return 'v';
    return 'h';
  }

  public get closest() {
    return this.distance < TransformHelper.threshold;
  }

  public get rect() {
    return calcRectOfAxisLineSegment(this);
  }

  public getClosestEdge(rect: Rect) {
    const threshold = TransformHelper.threshold;
    if (this.direction === 'h') {
      if (Math.abs(this.start.y - rect.top) < threshold) return 'ht';
      if (Math.abs(this.start.y - (rect.top + rect.height / 2)) < threshold) return 'hc';
      if (Math.abs(this.start.y - rect.bottom) < threshold) return 'hb';
    } else {
      if (Math.abs(this.start.x - rect.left) < threshold) return 'vl';
      if (Math.abs(this.start.x - (rect.left + rect.width / 2)) < threshold) return 'vc';
      if (Math.abs(this.start.x - rect.right) < threshold) return 'vr';
    }
  }
}
