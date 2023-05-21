import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GomakePrimaryButton } from "@/components";
import AddIcon from "@mui/icons-material/Add";

import { AddNewProfileFrameModal } from "./add-new-profile-frame-modal";
import { materialProfileFrameState } from "./store/profile-frame";
import { useStyle } from "./style";

const HeaderFilter = () => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialProfileFrameStateValue = useRecoilValue<any>(
    materialProfileFrameState
  );

  return (
    <>
      <div style={clasess.addBtnStyle}>
        <GomakePrimaryButton
          style={clasess.btnStyle}
          leftIcon={<AddIcon />}
          onClick={() => {
            materialProfileFrameStateValue?.onOpnModalAdded();
          }}
        >
          {t("materials.profileFrames.admin.addNewProfileFrame")}
        </GomakePrimaryButton>
      </div>
      <AddNewProfileFrameModal />
    </>
  );
};
export { HeaderFilter };
