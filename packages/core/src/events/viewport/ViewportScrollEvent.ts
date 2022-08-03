import { ICustomEvent } from '@designer/utils';
import { AbstractViewportEvent } from './AbstractViewportEvent';

export class ViewportScrollEvent extends AbstractViewportEvent implements ICustomEvent {
  public type: string = 'viewport:scroll';
}
