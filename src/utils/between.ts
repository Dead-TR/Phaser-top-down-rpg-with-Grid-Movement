export const between = (min: number, max: number, rounded = true) => {
  const value = Math.random() * (max - min) + min;

  if (rounded) {
    return Math.round(value);
  } else {
    return value;
  }
};
