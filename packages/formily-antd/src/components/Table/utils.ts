const getCircularReplacer = () => {
  const seen = new WeakSet();
  return (key: string, value: any) => {
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) {
        return;
      }
      seen.add(value);
    }
    return value;
  };
};

/**
 * 一个更加安全的 stringify，可以解决循环依赖的问题
 * @param value
 */
export const stringify = (value: any) => JSON.stringify(value, getCircularReplacer());
