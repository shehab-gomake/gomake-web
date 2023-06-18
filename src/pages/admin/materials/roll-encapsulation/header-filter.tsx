import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GomakePrimaryButton } from "@/components";
import AddIcon from "@mui/icons-material/Add";

import { materialRollEncapsulationState } from "./store/roll-encapsulation";
import { AddRollEncapsulationModal } from "./add-roll-encapsulation-modal";
import { useStyle } from "./style";

const HeaderFilter = () => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialRollEncapsulationStateValue = useRecoilValue<any>(
    materialRollEncapsulationState
  );
  return (
    <>
      <div style={clasess.addBtnStyle}>
        <GomakePrimaryButton
          style={clasess.btnStyle}
          leftIcon={<AddIcon />}
          onClick={() => {
            materialRollEncapsulationStateValue?.onOpnModalAdded();
          }}
        >
          {t("materials.encapsulationRoll.admin.addNewRollEncapsulation")}
        </GomakePrimaryButton>
      </div>
      <AddRollEncapsulationModal />
    </>
  );
};
export { HeaderFilter };
