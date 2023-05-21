import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GomakePrimaryButton } from "@/components";
import AddIcon from "@mui/icons-material/Add";

import { AddNewMaterialRollPrintingModal } from "./add-new-material-roll-printing-modal";
import { materialMaterialRollPrintingState } from "./store/material-roll-printing";
import { useStyle } from "./style";

const HeaderFilter = () => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialMaterialRollPrintingStateValue = useRecoilValue<any>(
    materialMaterialRollPrintingState
  );

  return (
    <>
      <div style={clasess.addBtnStyle}>
        <GomakePrimaryButton
          style={clasess.btnStyle}
          leftIcon={<AddIcon />}
          onClick={() => {
            materialMaterialRollPrintingStateValue?.onOpnModalAdded();
          }}
        >
          {t("materials.printingMaterials.admin.addNewMaterialRollPrinting")}
        </GomakePrimaryButton>
      </div>
      <AddNewMaterialRollPrintingModal />
    </>
  );
};
export { HeaderFilter };
