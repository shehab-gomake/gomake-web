import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GomakePrimaryButton } from "@/components";
import AddIcon from "@mui/icons-material/Add";

import { AddNewFrameModal } from "./add-new-frame-modal";
import { materialFrameState } from "./store/frame";
import { useStyle } from "./style";

const HeaderFilter = () => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialFrameStateValue = useRecoilValue<any>(materialFrameState);

  return (
    <>
      <div style={clasess.addBtnStyle}>
        <GomakePrimaryButton
          style={clasess.btnStyle}
          leftIcon={<AddIcon />}
          onClick={() => {
            materialFrameStateValue?.onOpnModalAdded();
          }}
        >
          {t("materials.frames.admin.addNewFrame")}
        </GomakePrimaryButton>
      </div>
      <AddNewFrameModal />
    </>
  );
};
export { HeaderFilter };
