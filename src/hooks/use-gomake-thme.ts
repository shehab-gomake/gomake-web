import { getItem, setItem } from "@/services/storage-data";
import { ITheme, themeState } from "@/store";
import { userState } from "@/store/user";
import { useCallback, useEffect, useState } from "react";
import { useRecoilState } from "recoil";

const useGomakeTheme = () => {
  const [theme, setTheme] = useRecoilState(themeState);
  const changedTheme = (theme: ITheme) => {
    setTheme(theme);
  };
  const changeThemeMode = useCallback(() => {
    const selectedTheme: any = theme.themeMode;
    setItem("themeMode", selectedTheme === "dark" ? "light" : "dark");
  }, []);
  const getColor = useCallback(
    (pattern: string, degree: number) => {
      if (degree >= 500) {
        // @ts-ignore
        return theme[pattern].dark[degree];
      }
      const selectedTheme: any = theme.themeMode;
      if (selectedTheme === "dark") {
        let darkDegree: number;
        switch (degree) {
          case 500:
            darkDegree = 500;
            break;
          case 400:
            darkDegree = 600;
            break;
          case 300:
            darkDegree = 700;
            break;
          case 200:
            darkDegree = 800;
            break;
          case 100:
            darkDegree = 900;
            break;

          default:
            break;
        }
        // @ts-ignore
        return theme[pattern].dark[darkDegree];
      } else {
        // @ts-ignore
        return theme[pattern].light[degree];
      }
    },
    [theme]
  );
  const primaryColor = useCallback(
    (degree: number) => {
      return getColor("primary", degree);
    },
    [theme]
  );
  const secondColor = useCallback(
    (degree: number) => {
      return getColor("second", degree);
    },
    [theme]
  );
  const successColor = useCallback(
    (degree: number) => {
      return getColor("success", degree);
    },
    [theme]
  );
  const warningColor = useCallback(
    (degree: number) => {
      return getColor("warning", degree);
    },
    [theme]
  );
  const errorColor = useCallback(
    (degree: number) => {
      return getColor("error", degree);
    },
    [theme]
  );
  const neutralColor = useCallback(
    (degree: number) => {
      return getColor("neutral", degree);
    },
    [theme]
  );
  return {
    theme,
    changedTheme,
    changeThemeMode,
    successColor,
    secondColor,
    primaryColor,
    neutralColor,
    errorColor,
    warningColor,
  };
};

export { useGomakeTheme };
