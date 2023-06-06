export const convertWidthToVW = (width: number) => {
  return `${(width / 1468) * 100}vw`;
};
export const convertHeightToVH = (width: number) => {
  return `${(width / 1024) * 100}vh`;
};
export const leftRightAdapter = (dir: string, size: number) => {
  return dir === "rtl" ? { right: size } : { left: size };
};

export const DateFormatterDDMMYYYY = (date: string) => {
  if (date) {
    let myDate = date?.split("T")[0];
    let myTime = date?.split("T")[1];
    let day = myDate?.split("-")[2];
    let month = myDate?.split("-")[1];
    let year = myDate?.split("-")[0];
    return `${day}/${month}/${year} :${myTime}`;
  }
};
