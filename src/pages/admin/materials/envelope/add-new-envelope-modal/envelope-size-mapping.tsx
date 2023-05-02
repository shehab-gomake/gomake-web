import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GoMakeAutoComplate, GomakeTextInput } from "@/components";

import { materialEnvelopeState } from "../store/plat";
import { useStyle } from "./style";
import { EnvelopeSizeInputs } from "../shared-inputs-widget/envelope-size-inputs";

const PlatSizeMapping = ({ index }) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialPlatsStateValue = useRecoilValue<any>(materialEnvelopeState);

  return (
    <>
      <div
        key={index}
        style={index & 1 ? clasess.tableSecondSections : clasess.tableSections}
      >
        <EnvelopeSizeInputs index={index} />
      </div>
    </>
  );
};
export { PlatSizeMapping };
