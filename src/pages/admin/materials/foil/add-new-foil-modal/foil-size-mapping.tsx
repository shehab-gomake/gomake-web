import { useTranslation } from "react-i18next";

import { FoilSizeInputs } from "../shared-inputs-widget/foil-sizes-inputs";
import { useStyle } from "./style";

const FoilSizeMapping = ({ index }) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();

  return (
    <>
      <div
        key={index}
        style={index & 1 ? clasess.tableSecondSections : clasess.tableSections}
      >
        <FoilSizeInputs index={index} />
      </div>
    </>
  );
};
export { FoilSizeMapping };
