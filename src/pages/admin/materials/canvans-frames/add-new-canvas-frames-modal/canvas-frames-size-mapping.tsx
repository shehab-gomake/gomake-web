import { useTranslation } from "react-i18next";

import { CanvasFrameSizeInputs } from "../shared-inputs-widget/canvas-frame-sizes-inputs";
import { useStyle } from "./style";

const CanvasFrameSizeMapping = ({ index }) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();

  return (
    <>
      <div
        key={index}
        style={index & 1 ? clasess.tableSecondSections : clasess.tableSections}
      >
        <CanvasFrameSizeInputs index={index} />
      </div>
    </>
  );
};
export { CanvasFrameSizeMapping };
