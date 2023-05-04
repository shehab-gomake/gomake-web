import { useTranslation } from "react-i18next";

import { PlatSizeInputs } from "../shared-inputs-widget/packin-drum-sizes-inputs";
import { useStyle } from "./style";

const PlatSizeMapping = ({ index }) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();

  return (
    <>
      <div
        key={index}
        style={index & 1 ? clasess.tableSecondSections : clasess.tableSections}
      >
        <PlatSizeInputs index={index} />
      </div>
    </>
  );
};
export { PlatSizeMapping };
