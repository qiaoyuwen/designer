import { isArr, isPlainObj, isStr, reduce } from '../';
import { isNoNeedCompileObject } from './shared';

const ExpRE = /^\s*\{\{([\s\S]*)\}\}\s*$/;
const Registry = {
  silent: false,
  compile(expression: string, scope: Record<string | number | symbol, any> = {}) {
    if (Registry.silent) {
      try {
        return new Function('$root', `with($root) { return (${expression}); }`)(scope);
      } catch (err) {
        console.log('compile failed', err);
      }
    } else {
      return new Function('$root', `with($root) { return (${expression}); }`)(scope);
    }
  },
};

const silent = (value = true) => {
  Registry.silent = !!value;
};

const shallowCompile = <Source = any, Scope = any>(source: Source, scope?: Scope) => {
  if (isStr(source)) {
    const matched = source.match(ExpRE);
    if (!matched) return source;
    return Registry.compile(matched[1], scope);
  }
  return source;
};

const compile = <Source = any, Scope = any>(source: Source, scope?: Scope): any => {
  const seenObjects = [];
  const compile = (source: any) => {
    if (isStr(source)) {
      return shallowCompile(source, scope);
    } else if (isArr(source)) {
      return source.map((value: any) => compile(value));
    } else if (isPlainObj(source)) {
      if (isNoNeedCompileObject(source)) return source;
      const seenIndex = seenObjects.indexOf(source);
      if (seenIndex > -1) {
        return source;
      }
      const addIndex = seenObjects.length;
      seenObjects.push(source);
      const results = reduce(
        source,
        (buf, value, key) => {
          buf[key] = compile(value);
          return buf;
        },
        {},
      );
      seenObjects.splice(addIndex, 1);
      return results;
    }
    return source;
  };
  return compile(source);
};

export const compiler = {
  silent,
  shallowCompile,
  compile,
};
