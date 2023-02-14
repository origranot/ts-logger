export const isError = (obj: any) => {
  return Object.prototype.toString.call(obj) === '[object Error]';
};