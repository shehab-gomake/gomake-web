import { useTranslation } from "react-i18next";
import {
  GoMakeModal,
  GomakePrimaryButton,
  GomakeTextInput,
} from "@/components";

import { useStyle } from "./style";

const UpdatePricePerTonModal = ({
  openModal,
  onClose,
  onClickBtn,
  onChangeData,
}) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();

  return (
    <>
      <GoMakeModal
        openModal={openModal}
        modalTitle={"Update Price Per Ton"}
        onClose={onClose}
        insideStyle={clasess.insideStyle}
      >
        <div>
          <GomakeTextInput
            style={clasess.textInputStyle}
            placeholder="Enter Price"
            onChange={(e: any) => onChangeData(e.target.value)}
          />
          <div style={clasess.btnContainer}>
            <GomakePrimaryButton style={clasess.sendBtn} onClick={onClickBtn}>
              Update
            </GomakePrimaryButton>
          </div>
        </div>
      </GoMakeModal>
    </>
  );
};
export { UpdatePricePerTonModal };
