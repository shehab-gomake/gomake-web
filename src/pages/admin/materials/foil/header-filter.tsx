import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GomakePrimaryButton } from "@/components";
import AddIcon from "@mui/icons-material/Add";

import { AddNewFoilModal } from "./add-new-foil-modal";
import { materialFoilState } from "./store/foil";
import { useStyle } from "./style";

const HeaderFilter = () => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialFoilStateValue = useRecoilValue<any>(materialFoilState);

  return (
    <>
      <div style={clasess.addBtnStyle}>
        <GomakePrimaryButton
          style={clasess.btnStyle}
          leftIcon={<AddIcon />}
          onClick={() => {
            materialFoilStateValue?.onOpnModalAdded();
          }}
        >
          {t("materials.foils.admin.addNewFoil")}
        </GomakePrimaryButton>
      </div>
      <AddNewFoilModal />
    </>
  );
};
export { HeaderFilter };
