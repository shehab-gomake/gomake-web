import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GomakePrimaryButton } from "@/components";
import AddIcon from "@mui/icons-material/Add";

import { materialLaminationsState } from "./store/lamination";
//import { AddSheetModal } from "./add-sheet-modal";
import { useStyle } from "./style";

const HeaderFilter = () => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialLaminationsStateValue = useRecoilValue<any>(
    materialLaminationsState
  );

  return (
    <>
      <div style={clasess.addBtnStyle}>
        <GomakePrimaryButton
          style={clasess.btnStyle}
          leftIcon={<AddIcon />}
          onClick={() => {
            materialLaminationsStateValue?.onOpnModalAdded();
          }}
        >
          {t("materials.sheetPaper.admin.addNewSheet")}
        </GomakePrimaryButton>
      </div>
    </>
  );
};
export { HeaderFilter };
