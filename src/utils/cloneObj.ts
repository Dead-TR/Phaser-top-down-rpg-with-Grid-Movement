export const cloneObj = <T extends object>(value: T) => {
  return JSON.parse(JSON.stringify(value)) as T;
};
