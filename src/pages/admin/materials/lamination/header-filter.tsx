import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GomakePrimaryButton } from "@/components";
import AddIcon from "@mui/icons-material/Add";

import { materialSheetsState } from "./store/lamination";
import { AddSheetModal } from "./add-lamination-modal";
import { useStyle } from "./style";

const HeaderFilter = () => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialSheetsStateValue = useRecoilValue<any>(materialSheetsState);
  return (
    <>
      <div style={clasess.addBtnStyle}>
        <GomakePrimaryButton
          style={clasess.btnStyle}
          leftIcon={<AddIcon />}
          onClick={() => {
            materialSheetsStateValue?.onOpnModalAdded();
          }}
        >
          {t("materials.lamination.admin.addNewLamination")}
        </GomakePrimaryButton>
      </div>
      <AddSheetModal />
    </>
  );
};
export { HeaderFilter };
