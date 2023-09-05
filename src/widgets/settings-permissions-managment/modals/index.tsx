
import { useTranslation } from "react-i18next";
import {
  GoMakeModal,
  GomakePrimaryButton,
  GomakeTextInput,
} from "@/components";
import { useStyle } from "./style";



const AddRoleModal = ({
  openModal,
  modalTitle,
  onClose,

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
          <div>
            <div style={clasess.mainInputsContainer}>
              <GomakeTextInput
                style={clasess.textInputStyle}
                placeholder={t("permissionsSettings.Role name")}
          
              />
          
            </div>
            <div style={clasess.btnContainer}>
              <GomakePrimaryButton
                style={clasess.addBtnStyle}
        
              >
                {t("permissionsSettings.add")}
              </GomakePrimaryButton>
            </div>
          </div>
        </div>
      </GoMakeModal>
    </>
  );
};
export { AddRoleModal };
