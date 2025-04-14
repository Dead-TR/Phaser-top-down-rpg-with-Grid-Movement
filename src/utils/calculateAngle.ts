/**
 ** left: 0deg
 ** bottom: 90deg
 ** right: 180 deg
 ** top: 270 deg
 */
export const calculateAngle = (
  x1: number,
  y1: number,
  x2: number,
  y2: number,
) => {
  let angleRad = Math.atan2(y2 - y1, x2 - x1);
  let angleDeg = angleRad * (180 / Math.PI);

  if (angleDeg < 0) {
    angleDeg += 360;
  }

  return angleDeg;
};
