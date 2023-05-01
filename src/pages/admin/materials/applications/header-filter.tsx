import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GomakePrimaryButton } from "@/components";
import AddIcon from "@mui/icons-material/Add";

import { materialApplicationsState } from "./store/applications";
//import { AddSheetModal } from "./add-sheet-modal";
import { useStyle } from "./style";
import { AddApplicationModal } from "./add-applications-modal";

const HeaderFilter = () => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialApplicationsStateValue = useRecoilValue<any>(
    materialApplicationsState
  );

  return (
    <>
      <div style={clasess.addBtnStyle}>
        <GomakePrimaryButton
          style={clasess.btnStyle}
          leftIcon={<AddIcon />}
          onClick={() => {
            materialApplicationsStateValue?.onOpnModalAdded();
          }}
        >
          {t("materials.applications.admin.addNewApplication")}
        </GomakePrimaryButton>
      </div>
      <AddApplicationModal />
    </>
  );
};
export { HeaderFilter };
