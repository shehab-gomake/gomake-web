
import { useTranslation } from "react-i18next";
import {
  GoMakeModal,
  GomakePrimaryButton,
  GomakeTextInput,
} from "@/components";
import { useStyle } from "./style";
import { AddRole } from "./use-add-role";
import { useState } from "react";



const AddRoleModal = ({
  openModal,
  modalTitle,
  onClose,

}) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const { addNewRole } = AddRole();
  const [Val,setVal] = useState();

  const handleClick22222222= (val) => {
    addNewRole(val);
  };

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
                onChange={(e: any) => setVal(e.target.value)}
              />
          
            </div>
            <div style={clasess.btnContainer}>
              <GomakePrimaryButton
                style={clasess.addBtnStyle}
                onClick = { ()=>handleClick22222222(Val)}
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
