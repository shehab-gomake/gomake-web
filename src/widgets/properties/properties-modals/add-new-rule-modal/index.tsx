import { useTranslation } from "react-i18next";
import {
  GoMakeModal,
  GomakePrimaryButton,
  GomakeTextInput,
} from "@/components";

import { useStyle } from "./style";
import { useRecoilValue } from "recoil";
import { propertyState } from "../../property";

const AddNewItemModal = (props) => {
  debugger
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const propertyStateValue = useRecoilValue<any>(propertyState);
  let modalFlag = props.openModal
  return (
    <>
      <GoMakeModal
        openModal={modalFlag}
        modalTitle={t("properties.editRules")}
        onClose={() => {modalFlag = false}}
        insideStyle={clasess.insideStyle}
      >
        <div>
          <div style={{ width: "90%", marginTop: 10 }}>
            <GomakeTextInput
              style={clasess.textInputStyle}
              placeholder={t("sales.quote.item")}
            />
          </div>
          <div style={clasess.btnContainer}>
            <GomakePrimaryButton style={clasess.sendBtn}>
              {t("properties.addRule")}
            </GomakePrimaryButton>
          </div>
        </div>
      </GoMakeModal>
    </>
  );
};
export { AddNewItemModal };
