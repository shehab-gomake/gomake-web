import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GomakePrimaryButton } from "@/components";
import AddIcon from "@mui/icons-material/Add";

import { materialMagnetState } from "./store/magnets";
import { useStyle } from "./style";
import { AddMagnet } from "./add-magnet";

const HeaderFilter = () => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialMagnetStateValue = useRecoilValue<any>(materialMagnetState);

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
          {t("materials.magnets.admin.addNewMagnet")}
        </GomakePrimaryButton>
      </div>
      <AddMagnet />
    </>
  );
};
export { HeaderFilter };
