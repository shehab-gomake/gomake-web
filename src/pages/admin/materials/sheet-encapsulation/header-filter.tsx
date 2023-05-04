import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GomakePrimaryButton } from "@/components";
import AddIcon from "@mui/icons-material/Add";

import { AddNewSheetEncapsulationModal } from "./add-new-sheet-encapsulation-modal";
import { materialSheetEncapsulationState } from "./store/sheet-encapsulation";
import { useStyle } from "./style";

const HeaderFilter = () => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialSheetEncapsulationStateValue = useRecoilValue<any>(
    materialSheetEncapsulationState
  );

  return (
    <>
      <div style={clasess.addBtnStyle}>
        <GomakePrimaryButton
          style={clasess.btnStyle}
          leftIcon={<AddIcon />}
          onClick={() => {
            materialSheetEncapsulationStateValue?.onOpnModalAdded();
          }}
        >
          {t("materials.sheetEncapsulation.admin.addNewSheetEncapsulation")}
        </GomakePrimaryButton>
      </div>
      <AddNewSheetEncapsulationModal />
    </>
  );
};
export { HeaderFilter };
