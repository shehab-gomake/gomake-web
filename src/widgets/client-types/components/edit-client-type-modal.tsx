import { useTranslation } from "react-i18next";
import { GoMakeModal, GomakeTextInput } from "@/components";
import { Tooltip } from "@mui/material";
import { useStyle } from "../style";
import { useClientType } from "./use-client-type-modal";
import { PrimaryButton } from "@/components/button/primary-button";

const ClientTypeModal = ({
  openModal,
  onClose,
  modalTitle,
  clientTypeId,
  clientTypesCategories,
  selectedClientTypeId,
}: {
  openModal: boolean;
  onClose: () => void;
  modalTitle: string;
  clientTypeId: any;
  clientTypesCategories: any;
  selectedClientTypeId: string;
}) => {
  const { editedValues, handleInputChange, updateClientType } =
    useClientType(clientTypeId);

  const { t } = useTranslation();
  const { classes } = useStyle();

  const selectedItem = clientTypesCategories?.find(
    (item) => item.id === selectedClientTypeId
  );

  if (!selectedItem) return null;

  const handleUpdateClick = () => {
    const updatedClientType = {
      ...selectedItem,
      clientTypeName:
        editedValues[selectedItem.id]?.clientTypeName || selectedItem.label,
      additionProfits:
        editedValues[selectedItem.id]?.additionProfits ||
        selectedItem.additionProfits,
    };
    updateClientType(updatedClientType);
    onClose();
  };

  return (
    <GoMakeModal
      openModal={openModal}
      modalTitle={modalTitle}
      onClose={onClose}
      insideStyle={classes.insideStyle}
    >
      <div style={classes.optionStyle}>
        <div style={classes.textInputContainer}>
          <GomakeTextInput
            style={classes.textInputStyle}
            placeholder={t("products.addProduct.admin.enterName")}
            value={
              editedValues[selectedItem.id]?.clientTypeName ??
              selectedItem.label
            }
            onChange={(e) =>
              handleInputChange(
                selectedItem.id,
                "clientTypeName",
                e.target.value
              )
            }
          />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: "5px",
          }}
        >
          <Tooltip title={t("customers.modal.additionProfits")}>
            <GomakeTextInput
              style={{ ...classes.textInputStyle, width: "75px" }}
              value={
                editedValues[selectedItem.id]?.additionProfits ??
                selectedItem.additionProfits
              }
              type="number"
              onChange={(e) =>
                handleInputChange(
                  selectedItem.id,
                  "additionProfits",
                  e.target.value
                )
              }
            />
          </Tooltip>
          %
        </div>
      </div>
      <PrimaryButton variant={"contained"} onClick={handleUpdateClick}>
        {t("modal.update")}
      </PrimaryButton>
    </GoMakeModal>
  );
};

export { ClientTypeModal };
