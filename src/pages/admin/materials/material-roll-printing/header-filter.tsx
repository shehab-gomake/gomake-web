import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GomakePrimaryButton } from "@/components";
import AddIcon from "@mui/icons-material/Add";

import { AddNewTubeModal } from "./add-new-material-roll-printing-modal";
import { materialPlatsState } from "./store/plat";
import { useStyle } from "./style";

const HeaderFilter = () => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialPlatsStateValue = useRecoilValue<any>(materialPlatsState);

  return (
    <>
      <div style={clasess.addBtnStyle}>
        <GomakePrimaryButton
          style={clasess.btnStyle}
          leftIcon={<AddIcon />}
          onClick={() => {
            materialPlatsStateValue?.onOpnModalAdded();
          }}
        >
          {t("materials.printingMaterials.admin.addNewMaterialRollPrinting")}
        </GomakePrimaryButton>
      </div>
      <AddNewTubeModal />
    </>
  );
};
export { HeaderFilter };
