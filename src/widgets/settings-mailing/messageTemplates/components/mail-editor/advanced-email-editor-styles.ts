import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";

const useAdvancedEmailEditorStyles = () => {
  const classes = useMemo(() => {
    return {
      editorContent: {
        // This will be applied via className, styles are in globals.css
      },
    };
  }, []);

  return {
    classes,
  };
};

export { useAdvancedEmailEditorStyles };

