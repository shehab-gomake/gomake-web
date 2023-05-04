import { useTranslation } from "react-i18next";

import { PackinDrumSizeInputs } from "../shared-inputs-widget/packin-drum-sizes-inputs";
import { useStyle } from "./style";

const PackinDrumSizeMapping = ({ index }) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();

  return (
    <>
      <div
        key={index}
        style={index & 1 ? clasess.tableSecondSections : clasess.tableSections}
      >
        <PackinDrumSizeInputs index={index} />
      </div>
    </>
  );
};
export { PackinDrumSizeMapping };
