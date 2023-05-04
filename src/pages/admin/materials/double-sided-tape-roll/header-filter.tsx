import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GomakePrimaryButton } from "@/components";
import AddIcon from "@mui/icons-material/Add";

import { materialDoublesidedTapeRollState } from "./store/double-sided-tape-roll";
import { useStyle } from "./style";
import { AddDoubleSidedTapeRoll } from "./add-double-sided-tape-roll";

const HeaderFilter = () => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialDoublesidedTapeRollStateValue = useRecoilValue<any>(
    materialDoublesidedTapeRollState
  );

  return (
    <>
      <div style={clasess.addBtnStyle}>
        <GomakePrimaryButton
          style={clasess.btnStyle}
          leftIcon={<AddIcon />}
          onClick={() => {
            materialDoublesidedTapeRollStateValue?.onOpnModalAdded();
          }}
        >
          {t("materials.doubleSidedTapeRolls.admin.addNewDoubleSidedTapeRoll")}
        </GomakePrimaryButton>
      </div>
      <AddDoubleSidedTapeRoll />
    </>
  );
};
export { HeaderFilter };
