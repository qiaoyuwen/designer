import { untracked } from '@formily/reactive';
import { Engine } from './models';
import { DEFAULT_DRIVERS, DEFAULT_EFFECTS } from './presets';
import { IEngineProps } from './types';

export const createDesigner = (props: IEngineProps<Engine> = {}) => {
  const drivers = props.drivers || [];
  const effects = props.effects || [];
  // TODO
  // const shortcuts = props.shortcuts || []
  return untracked(
    () =>
      new Engine({
        ...props,
        effects: [...effects, ...DEFAULT_EFFECTS],
        drivers: [...drivers, ...DEFAULT_DRIVERS],
        // shortcuts: [...shortcuts, ...DEFAULT_SHORTCUTS],
      }),
  );
};
