import { defaultTheme } from "@/utils/default-theme";
import { atom } from "recoil";

export const themeState = atom({
  key: "themeState",
  default: defaultTheme,
});

export interface ITheme {
  themeMode: "light";
  primary: {
    light: {
      500: string;
      400: string;
      300: string;
      200: string;
      100: string;
      50: string;
    };
    dark: {
      500: string;
      600: string;
      700: string;
      800: string;
      900: string;
    };
  };
  second: {
    light: {
      500: string;
      400: string;
      300: string;
      200: string;
      100: string;
    };
    dark: {
      500: string;
      600: string;
      700: string;
      800: string;
      900: string;
    };
  };
  success: {
    light: {
      500: string;
      400: string;
      300: string;
      200: string;
      100: string;
    };
    dark: {
      500: string;
      600: string;
      700: string;
      800: string;
      900: string;
    };
  };
  warning: {
    light: {
      500: string;
      400: string;
      300: string;
      200: string;
      100: string;
    };
    dark: {
      500: string;
      600: string;
      700: string;
      800: string;
      900: string;
    };
  };
  error: {
    light: {
      500: string;
      400: string;
      300: string;
      200: string;
      100: string;
    };
    dark: {
      500: string;
      600: string;
      700: string;
      800: string;
      900: string;
    };
  };
  neutral: {
    light: {
      500: string;
      400: string;
      300: string;
      200: string;
      100: string;
    };
    dark: {
      500: string;
      600: string;
      700: string;
      800: string;
      900: string;
    };
  };
  gray: {
    light: {
      500: string;
      400: string;
      300: string;
      200: string;
      100: string;
    };
    dark: {
      500: string;
      600: string;
      700: string;
      800: string;
      900: string;
    };
  };
}

// export interface ITheme {
//   primary: {
//     light: {
//       500: string;
//       400: string;
//       300: string;
//       200: string;
//       100: string;
//     };
//     dark: {
//       500: string;
//       600: string;
//       700: string;
//       800: string;
//       900: string;
//     };
//   };
//   second: {
//     light: {
//       500: string;
//       400: string;
//       300: string;
//       200: string;
//       100: string;
//     };
//     dark: {
//       500: string;
//       600: string;
//       700: string;
//       800: string;
//       900: string;
//     };
//   };
//   success: {
//     light: {
//       500: string;
//       400: string;
//       300: string;
//       200: string;
//       100: string;
//     };
//     dark: {
//       500: string;
//       600: string;
//       700: string;
//       800: string;
//       900: string;
//     };
//   };
//   warning: {
//     light: {
//       500: string;
//       400: string;
//       300: string;
//       200: string;
//       100: string;
//     };
//     dark: {
//       500: string;
//       600: string;
//       700: string;
//       800: string;
//       900: string;
//     };
//   };
//   error: {
//     light: {
//       500: string;
//       400: string;
//       300: string;
//       200: string;
//       100: string;
//     };
//     dark: {
//       500: string;
//       600: string;
//       700: string;
//       800: string;
//       900: string;
//     };
//   };
//   neutral: {
//     light: {
//       500: string;
//       400: string;
//       300: string;
//       200: string;
//       100: string;
//     };
//     dark: {
//       500: string;
//       600: string;
//       700: string;
//       800: string;
//       900: string;
//     };
//   };
// }
