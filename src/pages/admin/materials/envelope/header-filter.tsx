import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GomakePrimaryButton } from "@/components";
import AddIcon from "@mui/icons-material/Add";

import { AddNewEnvelopeModal } from "./add-new-envelope-modal";
import { materialEnvelopeState } from "./store/envelope";
import { useStyle } from "./style";

const HeaderFilter = () => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialEnvelopesStateValue = useRecoilValue<any>(
    materialEnvelopeState
  );

  return (
    <>
      <div style={clasess.addBtnStyle}>
        <GomakePrimaryButton
          style={clasess.btnStyle}
          leftIcon={<AddIcon />}
          onClick={() => {
            materialEnvelopesStateValue?.onOpnModalAdded();
          }}
        >
          {t("materials.envelops.admin.addNewEnvelops")}
        </GomakePrimaryButton>
      </div>
      <AddNewEnvelopeModal />
    </>
  );
};
export { HeaderFilter };
