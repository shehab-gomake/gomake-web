import Stack from "@mui/material/Stack";
import { GoMakeModal } from "@/components";
import { SecondaryButton } from "@/components/button/secondary-button";
import { useStyle } from "./style";
import { PrimaryButton } from "@/components/button/primary-button";
import { IInput } from "@/components/form-inputs/interfaces";
import { FormInput } from "@/components/form-inputs/form-input";
import { PaymentInputs } from "./inputs";
import { SecondaryCheckBox } from "@/components/check-box/secondary-check-box";
import { useSendPaymentModal } from "./use-send-payment-modal";
import { Divider } from "@mui/material";
import currencySymbolMap from "currency-symbol-map";
import { DOCUMENT_TYPE } from "../../enums";
import { useEffect, useState } from "react";
import { useSnackBar } from "@/hooks/use-snack-bar";
import { checkArrayNotEmptyOrPhoneNotEmpty } from "@/utils/helpers";
import { getWhatsAppMessageApi, sendDocumentToClientApi } from "@/services/api-service/generic-doc/documents-api";
import { useGomakeAxios } from "@/hooks/use-gomake-axios";
import { useWhatsAppWeb } from "@/pages-components/quote-new/use-whats-app-web";

interface ISendPaymentProps {
  openPaymentModal?: any;
  onClickClosePaymentModal?: any;
  paymentModalTitle?: any;
  documentType?: DOCUMENT_TYPE;
  isSendToClient?: boolean;
}
const SendPaymentModal = ({
  openPaymentModal,
  onClickClosePaymentModal,
  paymentModalTitle,
  documentType,
  isSendToClient
}: ISendPaymentProps) => {
  const { classes } = useStyle();
  const {
    t,
    payState,
    handleCopyPaymentLink,
    handleCheckBoxChange,
    onChangePaymentInputs,
    handleSendPaymentPage,
  } = useSendPaymentModal({ openPaymentModal, documentType });

  const {
    alertSuccessAdded,
    alertFaultAdded,
  } = useSnackBar();
  const { callApi } = useGomakeAxios();
  const { openWhatsAppWebLink } = useWhatsAppWeb();

  const handleSendUsingWhatsAppWeb = () => {
    const callBack = (res) => {
      const selectedContact =
        payState?.documentContacts &&
        payState.documentContacts[payState?.selectedContactIndex];
      openWhatsAppWebLink(res?.data, selectedContact?.contactPhone);
    };
    getWhatsAppMessageApi(callApi, callBack, {
      documentId: payState?.documentId,
      documentType: documentType,
    });

    //setOpenWatsAppModal(true)
  };
  const onClickSendQuoteToClient = async () => {

    let messageType = null; // Default messageType
    if (payState.sendByMail && payState.sendBySms) {
      messageType = 2;
    } else if (payState.sendByMail) {
      messageType = 0;
    } else if (payState.sendBySms) {
      messageType = 1;
    }
    const callBack = (res) => {
      if (res?.success) {
        alertSuccessAdded();

        onClickClosePaymentModal();
      } else {
        alertFaultAdded();
      }
    };
    if (messageType) {
      await sendDocumentToClientApi(callApi, callBack, {
        documentType: documentType,
        document: {
          documentId: payState?.documentId,
          messageType,
        },
      });
    }
    if (payState?.sendByWhatsapp) {
      handleSendUsingWhatsAppWeb();
    }

  };

  return (
    <GoMakeModal
      insideStyle={classes.insideStyle}
      openModal={openPaymentModal}
      onClose={onClickClosePaymentModal}
      modalTitle={isSendToClient ? t("sales.quote.sendToClient") : paymentModalTitle}
    >
      <Stack
        direction={"column"}
        height={"100%"}
        justifyContent={"flex-start"}
        width={"100%"}
        gap={"30px"}
      >
        <Divider style={classes.dividerContainer} />
        <Stack display="flex" flexWrap="wrap" direction="row">
          {PaymentInputs(payState)
            .slice(0, 3)
            .map((item) => (
              <FormInput
                input={item as IInput}
                changeState={onChangePaymentInputs}
                error={false}
                key={item.name}
                readonly={!!item.readOnly}
              />
            ))}
        </Stack>
        {isSendToClient && PaymentInputs(payState)
          .slice(3, 4)
          .map((item) => (
            <Stack
              display="flex"
              flexWrap="wrap"
              direction="row"
              width={"max-content"}
              gap={"2px"}
            >
              <FormInput
                input={item as IInput}
                changeState={onChangePaymentInputs}
                error={false}
                key={item.name}
                readonly={!!item.readOnly}
              />
            </Stack>
          ))}
        {!isSendToClient && PaymentInputs(payState)
          .slice(3)
          .map((item) => (
            <Stack
              display="flex"
              flexWrap="wrap"
              direction="row"
              width={"max-content"}
              gap={"2px"}
            >
              <FormInput
                input={item as IInput}
                changeState={onChangePaymentInputs}
                error={false}
                key={item.name}
                readonly={!!item.readOnly}
              />
              {item.name === "percentageOfTotal" && (
                <div style={classes.symbolStyle}>%</div>
              )}
              {item.name === "totalToPay" && (
                <div style={classes.symbolStyle}>
                  {currencySymbolMap(payState?.currency)}
                </div>
              )}
            </Stack>
          ))}
        <Stack display="flex" flexWrap="wrap" direction="row" gap="10px">
          <div style={classes.inputLbl}>
            {" "}
            <SecondaryCheckBox
              sx={{ padding: "2px" }}
              checked={payState?.sendBySms || false}
              onChange={(event) =>
                handleCheckBoxChange("sendBySms", event.target.checked)
              }
            />
            SMS
          </div>
          <div style={classes.inputLbl}>
            <SecondaryCheckBox
              sx={{ padding: "2px" }}
              checked={payState?.sendByMail || false}
              onChange={(event) =>
                handleCheckBoxChange("sendByMail", event.target.checked)
              }
            />
            {t("sales.quote.email")}
          </div>
          <div style={classes.inputLbl}>
            <SecondaryCheckBox
              sx={{ padding: "2px" }}
              checked={payState?.sendByWhatsapp || false}
              onChange={(event) =>
                handleCheckBoxChange("sendByWhatsapp", event.target.checked)
              }
            />
            {t("sales.quote.whatsApp")}
          </div>
        </Stack>
        {/* Third section */}
        <Stack direction={"row"} gap={"10px"} alignItems={"center"} justifyContent={"space-between"}>
          <SecondaryButton
            variant="contained"
            onClick={isSendToClient ? onClickSendQuoteToClient : handleSendPaymentPage}
            style={{ width: "50%", height: "35px", minWidth: "fit-content" }}
          >
            {isSendToClient ? t("sales.quote.sendToClient") : t("prePayment.sendPaymentPage")}
          </SecondaryButton>
          {
            !isSendToClient && (
              <SecondaryButton
                variant="outlined"
                onClick={handleCopyPaymentLink}
                style={{ width: "30%", height: "35px", minWidth: "fit-content" }}
              >
                {t("prePayment.copyPaymentLink")}
              </SecondaryButton>
            )
          }
          <PrimaryButton
            variant="outlined"
            onClick={onClickClosePaymentModal}
            style={{ width: "20%", height: "35px" }}
          >
            {t("modal.cancel")}
          </PrimaryButton>
        </Stack>
      </Stack>
    </GoMakeModal>
  );
};
export { SendPaymentModal };
