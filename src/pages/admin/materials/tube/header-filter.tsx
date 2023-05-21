import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GomakePrimaryButton } from "@/components";
import AddIcon from "@mui/icons-material/Add";

import { AddNewTubeModal } from "./add-new-tube-modal";
import { materialTubeState } from "./store/tube";
import { useStyle } from "./style";

const HeaderFilter = () => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialTubeStateValue = useRecoilValue<any>(materialTubeState);

  return (
    <>
      <div style={clasess.addBtnStyle}>
        <GomakePrimaryButton
          style={clasess.btnStyle}
          leftIcon={<AddIcon />}
          onClick={() => {
            materialTubeStateValue?.onOpnModalAdded();
          }}
        >
          {t("materials.tubes.admin.addNewTubes")}
        </GomakePrimaryButton>
      </div>
      <AddNewTubeModal />
    </>
  );
};
export { HeaderFilter };
