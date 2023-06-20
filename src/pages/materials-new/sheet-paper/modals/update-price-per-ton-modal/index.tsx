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
  modalTitle,
  onClickBtn,
  onChangeData,
}) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();

  return (
    <>
      <GoMakeModal
        openModal={openModal}
        modalTitle={modalTitle}
        onClose={onClose}
        insideStyle={clasess.insideStyle}
      >
        <div>
          <GomakeTextInput
            style={clasess.textInputStyle}
            placeholder={t("materials.sheetPaper.enterPrice")}
            onChange={(e: any) => onChangeData(e.target.value)}
          />
          <div style={clasess.btnContainer}>
            <GomakePrimaryButton style={clasess.sendBtn} onClick={onClickBtn}>
              {t("materials.inputs.update")}
            </GomakePrimaryButton>
          </div>
        </div>
      </GoMakeModal>
    </>
  );
};
export { UpdatePricePerTonModal };
