import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GomakePrimaryButton } from "@/components";
import AddIcon from "@mui/icons-material/Add";

import { AddNewCanvasFramesModal } from "./add-new-canvas-frames-modal";
import { materialCanvasFramesState } from "./store/canvas-frames";
import { useStyle } from "./style";

const HeaderFilter = () => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialCanvasFramesStateValue = useRecoilValue<any>(
    materialCanvasFramesState
  );

  return (
    <>
      <div style={clasess.addBtnStyle}>
        <GomakePrimaryButton
          style={clasess.btnStyle}
          leftIcon={<AddIcon />}
          onClick={() => {
            materialCanvasFramesStateValue?.onOpnModalAdded();
          }}
        >
          {t("materials.canvasFrames.admin.addNewCanvasFrame")}
        </GomakePrimaryButton>
      </div>
      <AddNewCanvasFramesModal />
    </>
  );
};
export { HeaderFilter };
