import { useTranslation } from "react-i18next";

import { PackinUnitSizeInputs } from "../shared-inputs-widget/packin-unit-sizes-inputs";
import { useStyle } from "./style";

const PackinUnitSizeMapping = ({ index }) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();

  return (
    <>
      <div
        key={index}
        style={index & 1 ? clasess.tableSecondSections : clasess.tableSections}
      >
        <PackinUnitSizeInputs index={index} />
      </div>
    </>
  );
};
export { PackinUnitSizeMapping };
