import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GomakeTextInput } from "@/components";

import { materialPlatsState } from "../store/plat";
import { useStyle } from "./style";
import { TubeSizeInputs } from "../shared-inputs-widget/tube-size-inputs";

const PlatSizeMapping = ({ index }) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialPlatsStateValue = useRecoilValue<any>(materialPlatsState);

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
export { PlatSizeMapping };
