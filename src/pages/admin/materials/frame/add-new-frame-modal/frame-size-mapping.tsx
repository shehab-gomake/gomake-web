import { useTranslation } from "react-i18next";

import { FrameSizeInputs } from "../shared-inputs-widget/frame-sizes-inputs";
import { useStyle } from "./style";

const FrameSizeMapping = ({ index }) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();

  return (
    <>
      <div
        key={index}
        style={index & 1 ? clasess.tableSecondSections : clasess.tableSections}
      >
        <FrameSizeInputs index={index} />
      </div>
    </>
  );
};
export { FrameSizeMapping };
