import {SCREEN_HEIGHT, SCREEN_WIDTH} from "@/utils/layout-config";

export const convertWidthToVW = (width: number) => {
  return `${(width / SCREEN_WIDTH) * 100}vw`;
};
export const convertHeightToVH = (height: number) => {
  return `${(height / SCREEN_HEIGHT) * 100}vh`;
};
export const leftRightAdapter = (dir: string, size: number) => {
  return dir === "rtl" ? { right: size } : { left: size };
};
export const adaptRight = (dir: string, size: number) => {
  return dir === "rtl"
    ? {
        right: size,
      }
    : {
        left: size,
      };
};
export const adaptLeft = (dir: string, size: number) => {
  return dir === "rtl"
    ? {
        left: size,
      }
    : {
        right: size,
      };
};

export const adaptPaddingRight = (dir: string, size: number) => {
  return dir === "rtl"
    ? {
      paddingRight: size,
      }
    : {
      paddingLeft: size,
      };
};
export const adaptPaddingLeft = (dir: string, size: number) => {
  return dir === "rtl"
    ? {
        paddingLeft: size,
      }
    : {
        paddingRight: size,
      };
};

export const DateFormatterDDMMYYYY = (date: string) => {
  if (date) {
    let myDate = date?.split("T")[0];
    let hours = date?.split("T")[1]?.split(":")[0];
    let minutes = date?.split("T")[1]?.split(":")[1];
    let day = myDate?.split("-")[2];
    let month = myDate?.split("-")[1];
    let year = myDate?.split("-")[0];
    return `${day}/${month}/${year} : ${hours}:${minutes}`;
  }
};

export const DateFormatter = (dateTime: string) => {
  if (dateTime) {
    let date = dateTime?.split("T")[0];
    let day = date?.split("-")[2];
    let month = date?.split("-")[1];
    let year = date?.split("-")[0];
    return `${day}/${month}/${year}`;
  }
};
