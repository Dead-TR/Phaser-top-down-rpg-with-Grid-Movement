import { SceneConfig } from "type";
import { fastFloor } from "utils";

export const getSunPositionFromTime = (
  currentTime: SceneConfig["currentTime"],
  mapWidth: number,
  mapHeight: number,
) => {
  const coordinates = { x: mapWidth * 1.5, y: mapHeight * 0.5 };

  const sunFrom = fastFloor(currentTime);
  const percent = currentTime % 1;

  const maxX = mapWidth * 1.5,
    midX = mapWidth * 0.5,
    minX = mapWidth * -0.5;
  const downY = mapHeight * 1.5,
    midY = mapHeight * 0.5,
    topY = mapHeight * -0.5;

  switch (sunFrom) {
    case 0:
      coordinates.x = (maxX - midX) * (1 - percent) + midX; //toCenter
      coordinates.y = (downY - midY) * (1 - percent) - midY; //toTop
      break;
    case 1:
      coordinates.x = (maxX - midX) * (1 - percent) - midX; //toLeft
      coordinates.y = (downY - midY) * percent - midY; //toMid
      break;
    case 2:
      coordinates.x = (maxX - midX) * percent - midX; //toCenter
      coordinates.y = (midY + midY) * percent + midY; //toBottom
      break;
    case 3:
      coordinates.x = (midX + midX) * percent + midX; //toRight
      coordinates.y = (downY - midY) * (1 - percent) + midY; //toMid

      break;
    default:
      break;
  }

  return coordinates;
};
