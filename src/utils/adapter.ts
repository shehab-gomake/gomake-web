export const convertWidthToVW = (width: number) => {
  return `${(width / 1468) * 100}vw`;
};
export const convertHeightToVH = (width: number) => {
  return `${(width / 1024) * 100}vh`;
};
