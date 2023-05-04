import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GomakePrimaryButton } from "@/components";
import AddIcon from "@mui/icons-material/Add";

import { AddNewPlatModal } from "./add-new-packin-drum-modal";
import { materialPlatsState } from "./store/packin-drum";
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
          {t("materials.packinDrums.admin.addNewPackinDrum")}
        </GomakePrimaryButton>
      </div>
      <AddNewPlatModal />
    </>
  );
};
export { HeaderFilter };
