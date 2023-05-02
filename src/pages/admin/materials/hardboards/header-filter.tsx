import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GomakePrimaryButton } from "@/components";
import AddIcon from "@mui/icons-material/Add";

import { materialHardboardsState } from "./store/hardboards";
//import { AddSheetModal } from "./add-sheet-modal";
import { useStyle } from "./style";
import { AddLaminationModal } from "./add-hardboards-modal";

const HeaderFilter = () => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialHardboardsStateValue = useRecoilValue<any>(
    materialHardboardsState
  );

  return (
    <>
      <div style={clasess.addBtnStyle}>
        <GomakePrimaryButton
          style={clasess.btnStyle}
          leftIcon={<AddIcon />}
          onClick={() => {
            materialHardboardsStateValue?.onOpnModalAdded();
          }}
        >
          {t("materials.hardboards.admin.addNewHardboard")}
        </GomakePrimaryButton>
      </div>
      <AddLaminationModal />
    </>
  );
};
export { HeaderFilter };
