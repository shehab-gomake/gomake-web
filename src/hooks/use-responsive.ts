import { useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";

export const useIsMobile = () => {
  return useMediaQuery("(max-width: 768px)");
};

export const useMobileHeight = () => {
  const [mobileHeight, setMobileHeight] = useState("100vh");

  useEffect(() => {
    function updateHeight() {
      setMobileHeight(`${window.innerHeight}px`);
    }

    updateHeight(); // Set initial height
    window.addEventListener("resize", updateHeight);

    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  return mobileHeight;
};
