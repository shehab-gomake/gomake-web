import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GomakePrimaryButton } from "@/components";
import AddIcon from "@mui/icons-material/Add";

import { materialMagnetState } from "./store/varnish";
import { useStyle } from "./style";
import { AddMagnet } from "./add-varnish";

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
          {t("materials.varnishs.admin.addNewVarnishs")}
        </GomakePrimaryButton>
      </div>
      <AddMagnet />
    </>
  );
};
export { HeaderFilter };
