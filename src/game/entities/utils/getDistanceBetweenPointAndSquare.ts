export const getDistanceBetweenPointAndSquare = (
  point: { x: number; y: number },
  square: {
    x: number;
    y: number;
    width: number;
    height: number;
  },
) => {
  // Знайдемо ближню відстань до горизонтальних граней квадрата
  const distanceY = Math.max(
    0,
    point.y < square.y
      ? square.y - point.y
      : point.y > square.y + square.height
      ? point.y - (square.y + square.height)
      : 0,
  );

  // Знайдемо ближню відстань до вертикальних граней квадрата
  const distanceX = Math.max(
    0,
    point.x < square.x
      ? square.x - point.x
      : point.x > square.x + square.width
      ? point.x - (square.x + square.width)
      : 0,
  );

  // Знайдемо загальну відстань від гравця до найближчої грані
  const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);

  return distance;
};
