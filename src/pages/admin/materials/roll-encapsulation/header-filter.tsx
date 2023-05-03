import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GomakePrimaryButton } from "@/components";
import AddIcon from "@mui/icons-material/Add";

import { materialSheetsState } from "./store/roll-encapsulation";
import { AddSheetModal } from "./add-roll-encapsulation-modal";
import { useStyle } from "./style";

const HeaderFilter = () => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialSheetsStateValue = useRecoilValue<any>(materialSheetsState);
  return (
    <>
      <div style={clasess.addBtnStyle}>
        <GomakePrimaryButton
          style={clasess.btnStyle}
          leftIcon={<AddIcon />}
          onClick={() => {
            materialSheetsStateValue?.onOpnModalAdded();
          }}
        >
          {t("materials.encapsulationRoll.admin.addNewRollEncapsulation")}
        </GomakePrimaryButton>
      </div>
      <AddSheetModal />
    </>
  );
};
export { HeaderFilter };
