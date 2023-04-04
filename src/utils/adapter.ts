export const convertWidthToVW = (width: number) => {
  return `${(width / 1468) * 100}vw`;
};
export const convertHeightToVH = (width: number) => {
  return `${(width / 1024) * 100}vh`;
};
export const leftRightAdapter = (dir: string, size: number) => {
  return dir === "rtl"
    ? { right: `${size}px!important` }
    : { left: `${size}px!important` };
};
