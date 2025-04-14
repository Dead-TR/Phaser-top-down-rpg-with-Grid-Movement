export const findAndRemoveFromArray = <T>(arr: T[], element: T) => {
  const index = arr.indexOf(element);

  if (index !== -1) {
    arr.splice(index, 1);
  }

  return arr;
};
