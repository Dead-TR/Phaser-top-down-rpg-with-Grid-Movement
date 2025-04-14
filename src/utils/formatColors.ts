export const formatColor = (color: string) => {
  const colorValue = Number("0x" + color.substring(3, 9));
  const alpha = Number(color.substring(1, 3) || 255) / 255;

  return {
    color: colorValue,
    alpha,
  };
};
