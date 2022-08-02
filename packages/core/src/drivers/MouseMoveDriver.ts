import { EventDriver } from '@designer/utils';
import { Engine } from '../models/Engine';
import { MouseMoveEvent } from '../events';
export class MouseMoveDriver extends EventDriver<Engine> {
  public request: number = null;

  public onMouseMove = (e: MouseEvent) => {
    this.request = requestAnimationFrame(() => {
      cancelAnimationFrame(this.request);
      this.dispatch(
        new MouseMoveEvent({
          clientX: e.clientX,
          clientY: e.clientY,
          pageX: e.pageX,
          pageY: e.pageY,
          target: e.target,
          view: e.view,
        }),
      );
    });
  };

  public attach() {
    this.addEventListener('mousemove', this.onMouseMove, {
      mode: 'onlyOne',
    });
  }

  public detach() {
    this.removeEventListener('mouseover', this.onMouseMove, {
      mode: 'onlyOne',
    });
  }
}
