export const isCoordinatesInRange = (
  region: {
    leftTopX: number;
    leftTopY: number;
    rightBottomX: number;
    rightBottomY: number;
  },
  checkObject: {
    leftTopX: number;
    leftTopY: number;
    rightBottomX: number;
    rightBottomY: number;
  },
) =>
  checkObject.leftTopX >= region.leftTopX &&
  checkObject.leftTopY >= region.leftTopY &&
  checkObject.rightBottomX <= region.rightBottomX &&
  checkObject.rightBottomY <= region.rightBottomY;
