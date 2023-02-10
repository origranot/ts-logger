export const stringify = (obj: Object) => {
  const seen = new Set();
  return JSON.stringify(obj, function (key, val) {
    if (val && typeof val === 'object') {
      if (seen.has(val)) {
        return '[Circular]';
      }
      seen.add(val);
    }
    return val;
  });
};
