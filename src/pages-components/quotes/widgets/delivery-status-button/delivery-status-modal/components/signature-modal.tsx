import { GoMakeModal } from "@/components";
import { useStyle } from "../style";
import { Button, Stack } from "@mui/material";
import { useTranslation } from "react-i18next";
import { DeleteIcon, WArrowIcon } from "../../utils/icons";
import { PrimaryButton } from "@/components/button/primary-button";
import { useRef } from "react";
import { useGomakeAxios, useSnackBar } from "@/hooks";
import SignatureCanvas from "react-signature-canvas";
import { createDocumentDeliveryApi } from "@/services/api-service/document-deliveries/create-document-delivery";
import { DOCUMENT_TYPE } from "@/pages-components/quotes/enums";

export interface ISignatureModalProps {
  openModal: boolean;
  onCloseModal: () => void;
  onCloseAllModals: () => void;
  documentType: DOCUMENT_TYPE;
  documentId: string;
  selectedItems: any;
  setSelectedItems: any;
  editableQuantities?: any;
  setEditableQuantities?: any;
  setDocumentItems?: any;
  deliveryState?: any;
  isMobile?: boolean;
  onClickOpenMoveOrderToReadyModal: any;
  document: any;
}

const SignatureModal = ({
  openModal,
  onCloseModal,
  documentId,
  onCloseAllModals,
  documentType,
  selectedItems,
  setSelectedItems,
  editableQuantities,
  setEditableQuantities,
  setDocumentItems,
  deliveryState,
  isMobile = false,
  onClickOpenMoveOrderToReadyModal,
  document,
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
        const isShowMoveToReadyModal = res?.data?.isShowMoveToReadyModal;
        setEditableQuantities({});
        setSelectedItems([]);
        setDocumentItems(res.data?.data);
        alertSuccessUpdate();
        onCloseAllModals();
        setTimeout(() => {
          isShowMoveToReadyModal && onClickOpenMoveOrderToReadyModal(document);
        }, 500);
      } else {
        alertFaultUpdate();
      }
    };
    await createDocumentDeliveryApi(callApi, callBack, {
      documentType,
      documentId,
      signImage,
      items: updatedSelectedData,
      ...deliveryState,
    });
  };

  return (
    <GoMakeModal
      modalTitle={t("sales.documentDeliveries.signature")}
      insideStyle={{
        width: "640px",
        maxWidth: "90vw",
        height: isMobile ? "unset" : "fit-content",
        minHeight: "auto",
      }}
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
