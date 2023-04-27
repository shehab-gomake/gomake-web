import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GomakePrimaryButton } from "@/components";
import AddIcon from "@mui/icons-material/Add";

import { materialSheetsState } from "./store/sheets";
import { AddSheetModal } from "./add-sheet-modal";
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
          {t("materials.sheetPaper.admin.addNewSheet")}
        </GomakePrimaryButton>
      </div>
      <AddSheetModal />
    </>
  );
};
export { HeaderFilter };
