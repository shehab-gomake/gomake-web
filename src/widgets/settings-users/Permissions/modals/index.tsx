
import { useTranslation } from "react-i18next";
import {
  GoMakeModal,
  GomakePrimaryButton,
  GomakeTextInput,
} from "@/components";
import { useStyle } from "./style";
import { AddRole } from "./use-add-role";
import { useState } from "react";
import { EditIcon, RemoveIcon } from "@/icons";



const AddRoleModal = ({
  openModal,
  modalTitle,
  onClose,
  roleId,
  updateRole,
}) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const { addNewRole } = AddRole();
  const [Val,setVal] = useState(roleId || '');

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
                 {roleId &&   <div style={{display:"flex",gap:"10px"}}> <EditIcon/> <RemoveIcon/></div>}
            </div>
         
            <div style={clasess.btnContainer}>
              <GomakePrimaryButton
                style={clasess.addBtnStyle}
                onClick={() => {
                  if (roleId) {
                    // If roleId is provided, it's an update
                    updateRole(roleId, Val); // Pass the roleId and updated value
                  } else {
                    // Otherwise, it's a new role
                    handleClick22222222(Val);
                  }
                  onClose(); // Close the modal
                }}
              >
                {roleId ? t("permissionsSettings.update") : t("permissionsSettings.add")}
             
              </GomakePrimaryButton>
            </div>
          </div>
        </div>
      </GoMakeModal>
    </>
  );
};
export { AddRoleModal };
