import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GomakePrimaryButton } from "@/components";
import AddIcon from "@mui/icons-material/Add";

import { AddNewPackinDrumModal } from "./add-new-packin-drum-modal";
import { materialPackinDrumState } from "./store/packin-drum";
import { useStyle } from "./style";

const HeaderFilter = () => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialPackinDrumStateValue = useRecoilValue<any>(
    materialPackinDrumState
  );

  return (
    <>
      <div style={clasess.addBtnStyle}>
        <GomakePrimaryButton
          style={clasess.btnStyle}
          leftIcon={<AddIcon />}
          onClick={() => {
            materialPackinDrumStateValue?.onOpnModalAdded();
          }}
        >
          {t("materials.packinDrums.admin.addNewPackinDrum")}
        </GomakePrimaryButton>
      </div>
      <AddNewPackinDrumModal />
    </>
  );
};
export { HeaderFilter };
