import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GomakePrimaryButton } from "@/components";
import AddIcon from "@mui/icons-material/Add";

import { useStyle } from "./style";
import { materialLaminationState } from "./store/lamination";
import { AddLaminationModal } from "./add-lamination-modal";

const HeaderFilter = () => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialLaminationStateValue = useRecoilValue<any>(
    materialLaminationState
  );
  return (
    <>
      <div style={clasess.addBtnStyle}>
        <GomakePrimaryButton
          style={clasess.btnStyle}
          leftIcon={<AddIcon />}
          onClick={() => {
            materialLaminationStateValue?.onOpnModalAdded();
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
