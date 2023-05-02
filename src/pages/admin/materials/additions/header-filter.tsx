import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GomakePrimaryButton } from "@/components";
import AddIcon from "@mui/icons-material/Add";

import { materialAdditionsState } from "./store/additions";
//import { AddSheetModal } from "./add-sheet-modal";
import { useStyle } from "./style";
import { AddAdditionModal } from "./add-additions-modal";

const HeaderFilter = () => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialAdditionsStateValue = useRecoilValue<any>(
    materialAdditionsState
  );

  return (
    <>
      <div style={clasess.addBtnStyle}>
        <GomakePrimaryButton
          style={clasess.btnStyle}
          leftIcon={<AddIcon />}
          onClick={() => {
            materialAdditionsStateValue?.onOpnModalAdded();
          }}
        >
          {t("materials.additions.admin.addNewAddition")}
        </GomakePrimaryButton>
      </div>
      <AddAdditionModal />
    </>
  );
};
export { HeaderFilter };
