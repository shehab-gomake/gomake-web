import { getItem } from "@/services/storage-data";
import { themeState } from "@/store";
import React from "react";
import { useEffect } from "react";
import { useRecoilState } from "recoil";

const ThemeProvider = () => {
  const [theme, setTheme] = useRecoilState(themeState);
  useEffect(() => {
    if (typeof window !== "undefined") {
      setTheme({
        ...theme,
        themeMode: getItem("themeMode") || "light",
      });
    }
  }, []);
  return <></>;
};

export { ThemeProvider };
