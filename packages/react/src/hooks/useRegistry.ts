import { GlobalRegistry, IDesignerRegistry } from '@designer/core';
import { globalThisPolyfill } from '@designer/utils';

export const useRegistry = (): IDesignerRegistry => {
  return globalThisPolyfill['__DESIGNER_REGISTRY__'] || GlobalRegistry;
};
