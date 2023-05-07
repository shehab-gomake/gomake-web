import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GomakePrimaryButton } from "@/components";
import AddIcon from "@mui/icons-material/Add";

import { AddNewPackingsModal } from "./add-new-packing-modal";
import { materialPackingsState } from "./store/packings";
import { useStyle } from "./style";

const HeaderFilter = () => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialPackingsStateValue = useRecoilValue<any>(materialPackingsState);

  return (
    <>
      <div style={clasess.addBtnStyle}>
        <GomakePrimaryButton
          style={clasess.btnStyle}
          leftIcon={<AddIcon />}
          onClick={() => {
            materialPackingsStateValue?.onOpnModalAdded();
          }}
        >
          {t("materials.packings.admin.addNewPacking")}
        </GomakePrimaryButton>
      </div>
      <AddNewPackingsModal />
    </>
  );
};
export { HeaderFilter };
