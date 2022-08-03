import { EventDriver } from '@designer/utils';
import { Engine } from '../models/Engine';
import { MouseClickEvent, MouseDoubleClickEvent } from '../events';

export class MouseClickDriver extends EventDriver<Engine> {
  public onMouseClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target?.closest(`*[${this.engine.props.clickStopPropagationAttrName}]`)) {
      return;
    }
    this.dispatch(
      new MouseClickEvent({
        clientX: e.clientX,
        clientY: e.clientY,
        pageX: e.pageX,
        pageY: e.pageY,
        target: e.target,
        view: e.view,
      }),
    );
  };

  public onMouseDoubleClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target?.closest(`*[${this.engine.props.clickStopPropagationAttrName}]`)) {
      return;
    }
    this.dispatch(
      new MouseDoubleClickEvent({
        clientX: e.clientX,
        clientY: e.clientY,
        pageX: e.pageX,
        pageY: e.pageY,
        target: e.target,
        view: e.view,
      }),
    );
  };

  public attach() {
    this.addEventListener('click', this.onMouseClick, {
      mode: 'onlyChild',
    });
    this.addEventListener('dblclick', this.onMouseDoubleClick, {
      mode: 'onlyChild',
    });
  }

  public detach() {
    this.removeEventListener('click', this.onMouseClick, {
      mode: 'onlyChild',
    });
    this.removeEventListener('dblclick', this.onMouseDoubleClick, {
      mode: 'onlyChild',
    });
  }
}
