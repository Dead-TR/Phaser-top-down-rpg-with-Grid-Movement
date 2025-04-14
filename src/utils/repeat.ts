export const repeat = <T>(
  numbers: number,
  iterator: (index: number, numbers: number) => T,
) => {
  const acc = Array<T>(Math.max(0, numbers));

  for (var i = 0; i < numbers; i++) {
    acc[i] = iterator(i, numbers);
  }

  return acc;
};
