import { useTranslation } from "react-i18next";

import { useStyle } from "./style";
import { TubeSizeInputs } from "../shared-inputs-widget/tube-size-inputs";

const TubeSizeMapping = ({ index }) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();

  return (
    <>
      <div
        key={index}
        style={index & 1 ? clasess.tableSecondSections : clasess.tableSections}
      >
        <TubeSizeInputs index={index} />
      </div>
    </>
  );
};
export { TubeSizeMapping };
