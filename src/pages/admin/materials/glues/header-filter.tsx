import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GomakePrimaryButton } from "@/components";
import AddIcon from "@mui/icons-material/Add";

import { materialGluesState } from "./store/glues";
import { useStyle } from "./style";
import { AddColor } from "./add-glue";

const HeaderFilter = () => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialMagnetStateValue = useRecoilValue<any>(materialGluesState);

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
          {t("materials.glues.addNewGlue")}
        </GomakePrimaryButton>
      </div>
      <AddColor />
    </>
  );
};
export { HeaderFilter };
