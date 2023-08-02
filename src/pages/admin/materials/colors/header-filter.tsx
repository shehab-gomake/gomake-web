import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GomakePrimaryButton } from "@/components";
import AddIcon from "@mui/icons-material/Add";

import { materialColorState } from "./store/colors";
import { useStyle } from "./style";
import { AddColor } from "./add-color";

const HeaderFilter = () => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialMagnetStateValue = useRecoilValue<any>(materialColorState);

  return (
    <>
      <div style={clasess.addBtnStyle}>
        <GomakePrimaryButton
          style={clasess.btnStyle}
          leftIcon={<AddIcon />}
          onClick={() => {
            materialMagnetStateValue?.onOpnModalAdded();
          }}
        >
          {t("materials.colors.addNewColor")}
        </GomakePrimaryButton>
      </div>
      <AddColor />
    </>
  );
};
export { HeaderFilter };
