import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GomakePrimaryButton } from "@/components";
import AddIcon from "@mui/icons-material/Add";

import { materialLaminationsState } from "./store/lamination";
//import { AddSheetModal } from "./add-sheet-modal";
import { useStyle } from "./style";
import { AddLaminationModal } from "./add-lamination-modal";

const HeaderFilter = () => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialLaminationsStateValue = useRecoilValue<any>(
    materialLaminationsState
  );

  return (
    <>
      <div style={clasess.addBtnStyle}>
        <GomakePrimaryButton
          style={clasess.btnStyle}
          leftIcon={<AddIcon />}
          onClick={() => {
            materialLaminationsStateValue?.onOpnModalAdded();
          }}
        >
          {t("materials.lamination.admin.addNewLamination")}
        </GomakePrimaryButton>
      </div>
      <AddLaminationModal />
    </>
  );
};
export { HeaderFilter };
