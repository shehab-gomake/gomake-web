import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GomakePrimaryButton } from "@/components";
import AddIcon from "@mui/icons-material/Add";

import { materialWideFormatMaterialState } from "./store/wide-format-material";
import { AddWideFormatMaterialModal } from "./add-wide-format-material-modal";
import { useStyle } from "./style";

const HeaderFilter = () => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialWideFormatMaterialStateValue = useRecoilValue<any>(
    materialWideFormatMaterialState
  );
  return (
    <>
      <div style={clasess.addBtnStyle}>
        <GomakePrimaryButton
          style={clasess.btnStyle}
          leftIcon={<AddIcon />}
          onClick={() => {
            materialWideFormatMaterialStateValue?.onOpnModalAdded();
          }}
        >
          {t("materials.wideFormatMaterial.admin.addNewWideFormatMaterial")}
        </GomakePrimaryButton>
      </div>
      <AddWideFormatMaterialModal />
    </>
  );
};
export { HeaderFilter };
