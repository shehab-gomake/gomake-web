import { FormInput } from "@/components/form-inputs/form-input";
import { IInput } from "@/components/form-inputs/interfaces";
import { addShipmentModalInputs } from "./inputs";
import { GoMakeModal, GomakePrimaryButton } from "@/components";
import { Stack } from "@mui/material";
import { FONT_FAMILY } from "@/utils/font-family";
import { useStyle } from "../style";
import { useAddShipmentModal } from "./use-add-shimpent-modal";

interface IProps {
  openModal: boolean;
  onClose: () => void;
  getAllShipmentTypes: any;
}

const AddShipmentModal = ({
  openModal,
  onClose,
  getAllShipmentTypes,
}: IProps) => {
  const { classes } = useStyle();
  const { t, handleClose, onChangeInputs, shipmentState, handleAddShipment } =
    useAddShipmentModal({ onClose, getAllShipmentTypes });

  return (
    <GoMakeModal
      modalTitle={t("shipmentTypes.addNewShipmentType")}
      insideStyle={{ height: "fit-content", width: "25%", gap: "10px" }}
      modalTitleStyle={{ color: "black", ...FONT_FAMILY.Inter(500, 22) }}
      openModal={openModal}
      withRoundedCloseIcon={false}
      onClose={handleClose}
    >
      <Stack gap={"8px"}>
        {addShipmentModalInputs(shipmentState, t).map((item) => (
          <div style={{ marginBottom: 10, width: "fit-content" }}>
            <FormInput
              input={item as IInput}
              changeState={onChangeInputs}
              error={item.required && !item.value}
              readonly={false}
            />
          </div>
        ))}

        <GomakePrimaryButton
          style={classes.btnStyle}
          onClick={handleAddShipment}
        >
          {t("navigationButtons.add")}
        </GomakePrimaryButton>
      </Stack>
    </GoMakeModal>
  );
};

export { AddShipmentModal };
