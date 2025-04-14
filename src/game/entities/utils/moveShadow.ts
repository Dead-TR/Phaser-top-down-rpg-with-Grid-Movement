const rotateAngle = 45;

const getPercent = (current: number, full: number) => {
  return (current * 1) / full;
};

const from0to1 = (angle: number) => getPercent(angle, 90);
const from1to0 = (angle: number) => 1 - getPercent(angle, 90);
const from0toMinus1 = (angle: number) => getPercent(angle, 90) * -1;
const fromMinus1to0 = (angle: number) => (1 - getPercent(angle, 90)) * -1;

export const moveShadow = (angle: number) => {
  angle = ((angle % 360) + 360) % 360;
  const coordinates = { x: 0, y: 0 };

  if (angle > 270) {
    const current = angle - 270;
    coordinates.x = from0to1(current);
    coordinates.y = fromMinus1to0(current);
  } else if (angle > 180) {
    const current = angle - 180;
    coordinates.x = fromMinus1to0(current);
    coordinates.y = from0toMinus1(current);
  } else if (angle > 90) {
    const current = angle - 90;
    coordinates.x = from0toMinus1(current);
    coordinates.y = from1to0(current);
  } else {
    coordinates.x = from1to0(angle);
    coordinates.y = from0to1(angle);
  }

  return coordinates;
};
