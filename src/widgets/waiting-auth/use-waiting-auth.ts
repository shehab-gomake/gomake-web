import { useCallback, useMemo, useState } from "react";

const useWidgetName = () => {
  const [isHover, setIsHover] = useState(false);

  const handleMouseEnter = useCallback(() => {
    setIsHover(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHover(false);
  }, []);

  return {
    handleMouseEnter,
    handleMouseLeave,
    isHover,
  };
};
export { useWidgetName };
