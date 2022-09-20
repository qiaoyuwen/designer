import { isFn } from '../';

const REVA_ACTIONS_KEY = Symbol.for('__REVA_ACTIONS');
const ProxyRaw = new WeakMap();

const isObservable = (target: any) => {
  return ProxyRaw.has(target);
};

export const isNoNeedCompileObject = (source: any) => {
  if ('$$typeof' in source && '_owner' in source) {
    return true;
  }
  if (source['_isAMomentObject']) {
    return true;
  }
  /* if (Schema.isSchemaInstance(source)) {
    return true;
  } */
  if (source[REVA_ACTIONS_KEY]) {
    return true;
  }
  if (isFn(source['toJS'])) {
    return true;
  }
  if (isFn(source['toJSON'])) {
    return true;
  }
  if (isObservable(source)) {
    return true;
  }
  return false;
};
