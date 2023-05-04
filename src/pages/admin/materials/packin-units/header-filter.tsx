import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GomakePrimaryButton } from "@/components";
import AddIcon from "@mui/icons-material/Add";

import { AddNewPackinUnitsModal } from "./add-new-packin-unit-modal";
import { materialPackinUnitsState } from "./store/packin-units";
import { useStyle } from "./style";

const HeaderFilter = () => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialPackinUnitsStateValue = useRecoilValue<any>(
    materialPackinUnitsState
  );

  return (
    <>
      <div style={clasess.addBtnStyle}>
        <GomakePrimaryButton
          style={clasess.btnStyle}
          leftIcon={<AddIcon />}
          onClick={() => {
            materialPackinUnitsStateValue?.onOpnModalAdded();
          }}
        >
          {t("materials.packinUnits.admin.addNewPackinUnit")}
        </GomakePrimaryButton>
      </div>
      <AddNewPackinUnitsModal />
    </>
  );
};
export { HeaderFilter };
