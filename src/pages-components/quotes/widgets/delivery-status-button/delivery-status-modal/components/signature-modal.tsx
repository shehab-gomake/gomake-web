import { GoMakeModal } from "@/components";
import { useStyle } from "../style";
import { Button, Stack } from "@mui/material";
import { useTranslation } from "react-i18next";
import { DeleteIcon, SaveIcon, SendIcon, WArrowIcon } from "../../icons";
import { PrimaryButton } from "@/components/button/primary-button";
import { useRef } from "react";
import { useGomakeAxios, useSnackBar } from "@/hooks";
import SignatureCanvas from "react-signature-canvas";
import { createDocumentDeliveryApi } from "@/services/api-service/document-deliveries/create-document-delivery";

export interface ISignatureModalProps {
  openModal: boolean;
  onCloseModal: () => void;
  onCloseUpdateModal: () => void;
  documentType: number;
  documentId: string;
  selectedItems: any;
  editableQuantities?: any;
  setEditableQuantities?: any;
  setDocumentItems?: any;
}

const SignatureModal = ({
  openModal,
  onCloseModal,
  onCloseUpdateModal,
  documentId,
  documentType,
  selectedItems,
  editableQuantities,
  setEditableQuantities,
  setDocumentItems,
}: ISignatureModalProps) => {
  const { classes } = useStyle();
  const { t } = useTranslation();
  const { alertFaultUpdate, alertSuccessUpdate } = useSnackBar();
  const { callApi } = useGomakeAxios();

  const sigPad = useRef<SignatureCanvas | null>(null);

  const clear = () => {
    sigPad.current.clear();
  };

  const save = () => {
    // if (sigPad.current && sigPad.current.isEmpty()) {
    //   alertFault(t("sales.cart.signatureEmptyError"));
    // }
    const dataURL = sigPad.current.getTrimmedCanvas().toDataURL("image/png");

    if (sigPad.current.isEmpty()) {
      onClickSave(null);
      return;
    }

    onClickSave(dataURL);
  };

  const onClickSave = async (signImage) => {
    const updatedSelectedData = selectedItems.map((item) => ({
      ...item,
      deliveredQuantity:
        editableQuantities[item.itemId] || item.deliveredQuantity,
    }));

    const callBack = (res) => {
      if (res.success) {
        debugger;
        setEditableQuantities({});

        setDocumentItems(res.data);

        alertSuccessUpdate();
        onCloseModal();
      } else {
        alertFaultUpdate();
      }
    };
    await createDocumentDeliveryApi(callApi, callBack, {
      documentType,
      documentId,
      signImage,
      // items: selectedItems,
      items: updatedSelectedData,
    });
  };

  return (
    <GoMakeModal
      modalTitle={t("sales.documentDeliveries.signature")}
      insideStyle={{ width: "640px", height: "fit-content" }}
      openModal={openModal}
      onClose={onCloseModal}
      modalTitleStyle={classes.modalTitle}
      withRoundedCloseIcon={false}
    >
      <Stack direction={"column"} gap={"16px"}>
        <Stack direction={"column"} gap={"2px"}>
          <div style={classes.StyledSignatureCanvasWrapper}>
            <SignatureCanvas
              ref={sigPad}
              penColor="black"
              canvasProps={{
                width: 580,
                height: 140,
                className: "sigCanvas",
              }}
            />
          </div>
          <Button
            variant="text"
            sx={classes.clearBtn}
            onClick={clear}
            startIcon={<DeleteIcon />}
            aria-label={t("Clear signature")}
          >
            {t("sales.quote.clear")}
          </Button>
        </Stack>

        {/* <Stack direction={"row"} gap={"12px"}>
          <PrimaryButton
            variant="outlined"
            style={classes.conBtn}
            onClick={save}
            startIcon={<SaveIcon />}
          >
            {t("sales.documentDeliveries.saveSignature")}
          </PrimaryButton>
          <PrimaryButton
            variant="outlined"
            style={classes.conBtn}
            onClick={handleSend}
            startIcon={<SendIcon />}
          >
            {t("sales.documentDeliveries.sendToCustomer")}
          </PrimaryButton>
        </Stack> */}

        <PrimaryButton
          variant="contained"
          style={classes.conBtn}
          onClick={save}
          startIcon={<WArrowIcon />}
        >
          {/* {t("sales.documentDeliveries.continueWithoutSignature")} */}
          {t("sales.documentDeliveries.continue")}
        </PrimaryButton>
      </Stack>
    </GoMakeModal>
  );
};

export { SignatureModal };
