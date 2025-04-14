import { fastFloor } from "utils";

export const getEdgeRadiusPoints = (
  x: number,
  y: number,
  radius: number,
  tileWidth: number,
  tileHeight: number,
) => {
  const leftTopX = fastFloor((x - radius) / tileWidth);
  const leftTopY = fastFloor((y - radius) / tileHeight);
  const rightBottomX = Math.ceil((x + radius) / tileWidth);
  const rightBottomY = Math.ceil((y + radius) / tileHeight);

  return {
    leftTopX,
    leftTopY,
    rightBottomX,
    rightBottomY,
  };
};
