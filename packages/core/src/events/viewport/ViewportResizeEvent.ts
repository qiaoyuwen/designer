import { ICustomEvent } from '@designer/utils';
import { AbstractViewportEvent } from './AbstractViewportEvent';

export class ViewportResizeEvent extends AbstractViewportEvent implements ICustomEvent {
  public type: string = 'viewport:resize';
}
