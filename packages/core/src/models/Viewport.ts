import {
  calcBoundaryRect,
  calcElementLayout,
  isHTMLElement,
  isPointInRect,
  IPoint,
  requestIdle,
  cancelIdle,
  globalThisPolyfill,
  Rect,
  IRect,
  isRectInRect,
  isRectIntersectionRect,
} from '@designer/utils';
import { action, define, observable } from '@formily/reactive';
import { Workspace } from './Workspace';
import { Engine } from './Engine';
import { TreeNode } from './TreeNode';

export interface IViewportProps {
  engine: Engine;
  workspace: Workspace;
  viewportElement: HTMLElement;
  contentWindow: Window;
  nodeIdAttrName: string;
  moveSensitive?: boolean;
  moveInsertionType?: IViewportMoveInsertionType;
}

export interface IViewportData {
  scrollX?: number;
  scrollY?: number;
  width?: number;
  height?: number;
}

export type IViewportMoveInsertionType = 'all' | 'inline' | 'block';

/**
 * 视口模型
 */
export class Viewport {
  public workspace: Workspace;

  public engine: Engine;

  public contentWindow: Window;

  public viewportElement: HTMLElement;

  public dragStartSnapshot: IViewportData;

  public scrollX: number = 0;

  public scrollY: number = 0;

  public width: number = 0;

  public height: number = 0;

  public mounted: boolean = false;

  public attachRequest: number;

  public nodeIdAttrName: string;

  public moveSensitive: boolean;

  public moveInsertionType: IViewportMoveInsertionType;

  public nodeElementsStore: Record<string, HTMLElement[]> = {};

  public constructor(props: IViewportProps) {
    this.workspace = props.workspace;
    this.engine = props.engine;
    this.moveSensitive = props.moveSensitive ?? false;
    this.moveInsertionType = props.moveInsertionType ?? 'all';
    this.viewportElement = props.viewportElement;
    this.contentWindow = props.contentWindow;
    this.nodeIdAttrName = props.nodeIdAttrName;
    this.setState();
    this.makeObservable();
    this.attachEvents();
  }

  public get isScrollLeft() {
    return this.scrollX === 0;
  }

  public get isScrollTop() {
    return this.scrollY === 0;
  }

  public get isScrollRight() {
    if (this.isIframe) {
      return this.width + this.contentWindow.scrollX >= this.contentWindow?.document?.body?.scrollWidth;
    } else if (this.viewportElement) {
      return this.viewportElement.offsetWidth + this.scrollX >= this.viewportElement.scrollWidth;
    }
  }

  public get isScrollBottom() {
    if (this.isIframe) {
      if (!this.contentWindow?.document?.body) return false;
      return this.height + this.contentWindow.scrollY >= this.contentWindow.document.body.scrollHeight;
    } else if (this.viewportElement) {
      if (!this.viewportElement) return false;
      return this.viewportElement.offsetHeight + this.viewportElement.scrollTop >= this.viewportElement.scrollHeight;
    }
  }

  public get viewportRoot() {
    return this.isIframe ? this.contentWindow?.document?.body : this.viewportElement;
  }

  public get isMaster() {
    return this.contentWindow === globalThisPolyfill;
  }

  public get isIframe() {
    return !!this.contentWindow?.frameElement && !this.isMaster;
  }

  public get scrollContainer() {
    return this.isIframe ? this.contentWindow : this.viewportElement;
  }

  public get rect() {
    if (this.viewportElement) {
      const rect = this.viewportElement.getBoundingClientRect();
      return new Rect(rect.x, rect.y, rect.width, rect.height);
    }
  }

  public get innerRect() {
    const rect = this.rect;
    return new Rect(0, 0, rect?.width, rect?.height);
  }

  public get offsetX() {
    const rect = this.rect;
    if (!rect) return 0;
    return rect.x;
  }

  public get offsetY() {
    const rect = this.rect;
    if (!rect) return 0;
    return rect.y;
  }

  public get scale() {
    if (!this.viewportElement) return 1;
    const clientRect = this.viewportElement.getBoundingClientRect();
    const offsetWidth = this.viewportElement.offsetWidth;
    if (!clientRect.width || !offsetWidth) return 1;
    return Math.round(clientRect.width / offsetWidth);
  }

  public get dragScrollXDelta() {
    return this.scrollX - this.dragStartSnapshot.scrollX;
  }

  public get dragScrollYDelta() {
    return this.scrollY - this.dragStartSnapshot.scrollY;
  }

  public cacheElements() {
    this.nodeElementsStore = {};
    this.viewportRoot?.querySelectorAll(`*[${this.nodeIdAttrName}]`).forEach((element: HTMLElement) => {
      const id = element.getAttribute(this.nodeIdAttrName);
      this.nodeElementsStore[id] = this.nodeElementsStore[id] || [];
      this.nodeElementsStore[id].push(element);
    });
  }

  public clearCache() {
    this.nodeElementsStore = {};
  }

  public getState() {
    const data: IViewportData = {};
    if (this.isIframe) {
      data.scrollX = this.contentWindow?.scrollX || 0;
      data.scrollY = this.contentWindow?.scrollY || 0;
      data.width = this.contentWindow?.innerWidth || 0;
      data.height = this.contentWindow?.innerHeight || 0;
    } else if (this.viewportElement) {
      data.scrollX = this.viewportElement?.scrollLeft || 0;
      data.scrollY = this.viewportElement?.scrollTop || 0;
      data.width = this.viewportElement?.clientWidth || 0;
      data.height = this.viewportElement?.clientHeight || 0;
    }
    return data;
  }

  public setState() {
    Object.assign(this, this.getState());
  }

  public takeDragStartSnapshot() {
    this.dragStartSnapshot = this.getState();
  }

  public elementFromPoint(point: IPoint) {
    if (this.contentWindow?.document) {
      return this.contentWindow.document.elementFromPoint(point.x, point.y);
    }
  }

  public matchViewport(target: HTMLElement | Element | Window | Document | EventTarget) {
    if (this.isIframe) {
      return (
        target === this.viewportElement || target === this.contentWindow || target === this.contentWindow?.document
      );
    } else {
      return target === this.viewportElement;
    }
  }

  public attachEvents() {
    const engine = this.engine;
    cancelIdle(this.attachRequest);
    this.attachRequest = requestIdle(() => {
      if (!engine) return;
      if (this.isIframe) {
        this.workspace.attachEvents(this.contentWindow, this.contentWindow);
      } else if (isHTMLElement(this.viewportElement)) {
        this.workspace.attachEvents(this.viewportElement, this.contentWindow);
      }
    });
  }

  public detachEvents() {
    if (this.isIframe) {
      this.workspace.detachEvents(this.contentWindow);
      this.workspace.detachEvents(this.viewportElement);
    } else if (this.viewportElement) {
      this.workspace.detachEvents(this.viewportElement);
    }
  }

  public onMount(element: HTMLElement, contentWindow: Window) {
    this.mounted = true;
    this.viewportElement = element;
    this.contentWindow = contentWindow;
    this.attachEvents();
    this.setState();
  }

  public onUnmount() {
    this.mounted = false;
    this.detachEvents();
  }

  public isPointInViewport(point: IPoint, sensitive?: boolean) {
    if (!this.rect) return false;
    if (!this.containsElement(document.elementFromPoint(point.x, point.y))) {
      return false;
    }
    return isPointInRect(point, this.rect, sensitive);
  }

  public isRectInViewport(rect: IRect) {
    if (!this.rect) return false;
    if (!this.containsElement(document.elementFromPoint(rect.x, rect.y))) {
      return false;
    }
    return isRectInRect(rect, this.rect);
  }

  public isRectIntersectionInViewport(rect: IRect) {
    if (!this.rect) return false;
    if (!this.containsElement(document.elementFromPoint(rect.x, rect.y))) {
      return false;
    }
    return isRectIntersectionRect(rect, this.rect);
  }

  public isPointInViewportArea(point: IPoint, sensitive?: boolean) {
    if (!this.rect) return false;
    return isPointInRect(point, this.rect, sensitive);
  }

  public isOffsetPointInViewport(point: IPoint, sensitive?: boolean) {
    if (!this.innerRect) return false;
    if (!this.containsElement(document.elementFromPoint(point.x, point.y))) return false;
    return isPointInRect(point, this.innerRect, sensitive);
  }

  public isOffsetRectInViewport(rect: IRect) {
    if (!this.innerRect) return false;
    if (!this.containsElement(document.elementFromPoint(rect.x, rect.y))) {
      return false;
    }
    return isRectInRect(rect, this.innerRect);
  }

  public makeObservable() {
    define(this, {
      scrollX: observable.ref,
      scrollY: observable.ref,
      width: observable.ref,
      height: observable.ref,
      setState: action,
      viewportElement: observable.ref,
      contentWindow: observable.ref,
    });
  }

  public findElementById(id: string): HTMLElement {
    if (!id) return;
    if (this.nodeElementsStore[id]) return this.nodeElementsStore[id][0];
    return this.viewportRoot?.querySelector(`*[${this.nodeIdAttrName}='${id}']`) as HTMLElement;
  }

  public findElementsById(id: string): HTMLElement[] {
    if (!id) return [];
    if (this.nodeElementsStore[id]) return this.nodeElementsStore[id];
    return Array.from(this.viewportRoot?.querySelectorAll(`*[${this.nodeIdAttrName}='${id}']`) ?? []);
  }

  public containsElement(element: HTMLElement | Element | EventTarget) {
    const root: Element | Document = this.viewportElement;
    if (root === element) return true;
    return root?.contains(element as any);
  }

  public getOffsetPoint(clientPoint: IPoint) {
    const data = this.getState();
    return {
      x: clientPoint.x - this.offsetX + data.scrollX,
      y: clientPoint.y - this.offsetY + data.scrollY,
    };
  }

  public getOffsetRect(clientRect: Rect) {
    const data = this.getState();
    return new Rect(
      clientRect.x - this.offsetX + data.scrollX,
      clientRect.y - this.offsetY + data.scrollY,
      clientRect.width,
      clientRect.height,
    );
  }

  //相对于页面
  public getElementClientRect(element: HTMLElement | Element) {
    const rect = element.getBoundingClientRect();
    const offsetWidth = element['offsetWidth'] ? element['offsetWidth'] : rect.width;
    const offsetHeight = element['offsetHeight'] ? element['offsetHeight'] : rect.height;
    return new Rect(
      rect.x,
      rect.y,
      this.scale !== 1 ? offsetWidth : rect.width,
      this.scale !== 1 ? offsetHeight : rect.height,
    );
  }

  //相对于页面
  public getElementClientRectById(id: string) {
    const elements = this.findElementsById(id);
    const rect = calcBoundaryRect(elements.map((element) => this.getElementClientRect(element)));
    if (rect) {
      if (this.isIframe) {
        return new Rect(rect.x + this.offsetX, rect.y + this.offsetY, rect.width, rect.height);
      } else {
        return new Rect(rect.x, rect.y, rect.width, rect.height);
      }
    }
  }

  //相对于视口
  public getElementOffsetRect(element: HTMLElement | Element) {
    const elementRect = element.getBoundingClientRect();
    if (elementRect) {
      if (this.isIframe) {
        return new Rect(
          elementRect.x + this.contentWindow.scrollX,
          elementRect.y + this.contentWindow.scrollY,
          elementRect.width,
          elementRect.height,
        );
      } else {
        return new Rect(
          (elementRect.x - this.offsetX + this.viewportElement.scrollLeft) / this.scale,
          (elementRect.y - this.offsetY + this.viewportElement.scrollTop) / this.scale,
          elementRect.width,
          elementRect.height,
        );
      }
    }
  }

  //相对于视口
  public getElementOffsetRectById(id: string) {
    const elements = this.findElementsById(id);
    if (!elements.length) return;

    const elementRect = calcBoundaryRect(elements.map((element) => this.getElementClientRect(element)));
    if (elementRect) {
      if (this.isIframe) {
        return new Rect(
          elementRect.x + this.contentWindow.scrollX,
          elementRect.y + this.contentWindow.scrollY,
          elementRect.width,
          elementRect.height,
        );
      } else {
        return new Rect(
          (elementRect.x - this.offsetX + this.viewportElement.scrollLeft) / this.scale,
          (elementRect.y - this.offsetY + this.viewportElement.scrollTop) / this.scale,
          elementRect.width,
          elementRect.height,
        );
      }
    }
  }

  public getValidNodeElement(node: TreeNode): Element {
    const getNodeElement = (node: TreeNode) => {
      if (!node) return;
      const ele = this.findElementById(node.id);
      if (ele) {
        return ele;
      } else {
        return getNodeElement(node.parent);
      }
    };
    return getNodeElement(node);
  }

  public getChildrenClientRect(node: TreeNode): Rect {
    if (!node?.children?.length) return;
    return calcBoundaryRect(
      node.children.reduce((buf, child) => {
        const rect = this.getValidNodeClientRect(child);
        if (rect) {
          return buf.concat(rect);
        }
        return buf;
      }, []),
    );
  }

  public getChildrenOffsetRect(node: TreeNode): Rect {
    if (!node?.children?.length) return;

    return calcBoundaryRect(
      node.children.reduce((buf, child) => {
        const rect = this.getValidNodeOffsetRect(child);
        if (rect) {
          return buf.concat(rect);
        }
        return buf;
      }, []),
    );
  }

  public getValidNodeClientRect(node: TreeNode): Rect {
    if (!node) return;
    const rect = this.getElementClientRectById(node.id);
    if (node && node === node.root && node.isInOperation) {
      if (!rect) return this.rect;
      return calcBoundaryRect([this.rect, rect]);
    }

    if (rect) {
      return rect;
    } else {
      return this.getChildrenClientRect(node);
    }
  }

  public getValidNodeOffsetRect(node: TreeNode): Rect {
    if (!node) return;
    let rect: Rect;
    const el = this.findElementById(node.id);
    if (node.containerClassName && el) {
      rect = this.getElementOffsetRect(el.querySelector(node.containerClassName));
    } else {
      rect = this.getElementOffsetRectById(node.id);
    }

    if (node && node === node.root && node.isInOperation) {
      if (!rect) return this.innerRect;
      return calcBoundaryRect([this.innerRect, rect]);
    }
    if (rect) {
      return rect;
    } else {
      return this.getChildrenOffsetRect(node);
    }
  }

  public getValidNodeLayout(node: TreeNode) {
    if (!node) return 'vertical';
    if (node.parent?.designerProps?.inlineChildrenLayout) return 'horizontal';
    return calcElementLayout(this.findElementById(node.id));
  }
}
