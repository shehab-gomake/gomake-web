import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GomakePrimaryButton } from "@/components";
import AddIcon from "@mui/icons-material/Add";

import { materialVarnishState } from "./store/varnish";
import { useStyle } from "./style";
import { AddVarnish } from "./add-varnish";

const HeaderFilter = () => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialVarnishStateValue = useRecoilValue<any>(materialVarnishState);

  return (
    <>
      <div style={clasess.addBtnStyle}>
        <GomakePrimaryButton
          style={clasess.btnStyle}
          leftIcon={<AddIcon />}
          onClick={() => {
            materialVarnishStateValue?.onOpnModalAdded();
          }}
        >
          {t("materials.varnishs.admin.addNewVarnishs")}
        </GomakePrimaryButton>
      </div>
      <AddVarnish />
    </>
  );
};
export { HeaderFilter };
