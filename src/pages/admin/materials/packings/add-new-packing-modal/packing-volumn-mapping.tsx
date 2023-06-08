import { useTranslation } from "react-i18next";

import { PackingVolumnInputs } from "../shared-inputs-widget/packin-volumns-inputs";
import { useStyle } from "./style";

const PackingVolumnsMapping = ({ index }) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();

  return (
    <>
      <div
        key={index}
        style={index & 1 ? clasess.tableSecondSections : clasess.tableSections}
      >
        <PackingVolumnInputs index={index} />
      </div>
    </>
  );
};
export { PackingVolumnsMapping };
