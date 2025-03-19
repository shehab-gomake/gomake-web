import { SCREEN_HEIGHT, SCREEN_WIDTH } from "@/utils/layout-config";

export const convertWidthToVW = (width: number) => {
  return `${(width / SCREEN_WIDTH) * 100}vw`;
};
export const convertHeightToVH = (height: number) => {
  return `${(height / SCREEN_HEIGHT) * 100}vh`;
};
export const leftRightAdapter = (dir: string, size: number) => {
  return dir === "rtl" ? { right: size } : { left: size };
};

export const leftLeftAdapter = (dir: string, size: number) => {
  return dir !== "rtl" ? { right: size } : { left: size };
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

export const adaptMarginRight = (dir: string, size: number) => {
  return dir === "rtl"
    ? {
        marginRight: size,
      }
    : {
        marginLeft: size,
      };
};

export const adaptMarginLeft = (dir: string, size: number) => {
  return dir === "rtl"
    ? {
        marginLeft: size,
      }
    : {
        marginRight: size,
      };
};
