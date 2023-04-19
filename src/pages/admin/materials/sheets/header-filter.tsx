import { useTranslation } from "react-i18next";
import AddIcon from "@mui/icons-material/Add";
import { GomakePrimaryButton } from "@/components";

import { useStyle } from "./style";
import { AddSheetModal } from "./add-sheet-modal";
import { useRecoilValue } from "recoil";
import { materialSheetsState } from "./store/sheets";

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
            console.log(materialSheetsStateValue);
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
