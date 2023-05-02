import { useTranslation } from "react-i18next";

import { useStyle } from "./style";
import { ProfileFormSizeInputs } from "../shared-inputs-widget/profile-frame-size-inputs";

const PlatSizeMapping = ({ index }) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();

  return (
    <>
      <div
        key={index}
        style={index & 1 ? clasess.tableSecondSections : clasess.tableSections}
      >
        <ProfileFormSizeInputs index={index} />
      </div>
    </>
  );
};
export { PlatSizeMapping };
