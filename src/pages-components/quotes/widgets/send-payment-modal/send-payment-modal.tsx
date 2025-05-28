import Stack from "@mui/material/Stack";
import { GoMakeModal, SecondSwitch } from "@/components";
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
import { useSnackBar } from "@/hooks/use-snack-bar";
import {
  getWhatsAppMessageApi,
  sendOrderReadyToClientApi,
  sendDocumentToClientApi,
} from "@/services/api-service/generic-doc/documents-api";
import { useGomakeAxios } from "@/hooks/use-gomake-axios";
import { useWhatsAppWeb } from "@/pages-components/quote-new/use-whats-app-web";
import { MessageType } from "@/pages-components/quote-new/use-quote";

interface ISendPaymentProps {
  openPaymentModal?: any;
  onClickClosePaymentModal?: any;
  paymentModalTitle?: any;
  documentType?: DOCUMENT_TYPE;
  isSendToClient?: boolean;
  isSendOrderReadyToClient?: boolean;
  showAlertModal: (params: { message: string; onConfirm?: () => void }) => void;
}

const SendPaymentModal = ({
  openPaymentModal,
  onClickClosePaymentModal,
  paymentModalTitle,
  documentType,
  isSendToClient,
  isSendOrderReadyToClient,
  showAlertModal,
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
  const { alertFaultSend, alertSuccessSend, alertFault } = useSnackBar();
  const { callApi } = useGomakeAxios();
  const { getWhatsWebUrl } = useWhatsAppWeb();
  const isReceipt = documentType === DOCUMENT_TYPE.receipt;

  //!here 4 done
  const handleSendUsingWhatsAppWeb = (sendWithInvoices = false) => {
    getWhatsAppMessageApi(
      callApi,
      (res) => {
        const selectedContact =
          payState?.documentContacts &&
          payState.documentContacts[payState?.selectedContactIndex];

        const url = getWhatsWebUrl(res?.data, selectedContact?.contactPhone);

        if (url) {
          window.open(url, "_blank");
        }
      },
      {
        documentId: payState?.documentId,
        documentType: documentType,
        ...(isReceipt ? { sendWithInvoices } : {}),
      }
    );
  };

  const onClickSendQuoteToClient = async (
    isSendOrderReadyToClient = false,
    sendWithInvoices = false
  ) => {
    const selectedContact =
      payState?.documentContacts &&
      payState.documentContacts[payState?.selectedContactIndex];

    let messageType: MessageType | null = null;

    if (payState.sendByMail && payState.sendBySms) {
      messageType = MessageType.Both;
    } else if (payState.sendByMail) {
      messageType = MessageType.Email;
    } else if (payState.sendBySms) {
      messageType = MessageType.SMS;
    }

    if (messageType === null) {
      alertFault(t("alerts.checkAtLeastOne"));
      return;
    }

    const callBack = (res) => {
      if (res?.success) {
        alertSuccessSend();
        onClickClosePaymentModal();
      } else {
        if (
          (messageType === MessageType.Email ||
            messageType === MessageType.Both) &&
          res?.errors?.message
        ) {
          if (res.errors.message === "agent_not_verified") {
            showAlertModal({
              message: t("alerts.agentEmailNotVerified"),
              onConfirm: async () => {
                await resendFromPrintHouseMail(
                  messageType,
                  isSendOrderReadyToClient
                );
              },
            });
          } else if (res.errors.message === "printHouse_mail_not_verified") {
            showAlertModal({
              message: t("alerts.printHouseMailNotVerified"),
            });
          } else {
            alertFaultSend();
          }
        } else {
          alertFaultSend();
        }
      }
    };

    const documentData: any = {
      [isSendOrderReadyToClient ? "orderId" : "documentId"]:
        payState?.documentId,
      messageType,
    };

    if (selectedContact?.contactPhone) {
      documentData.contactPhone = selectedContact.contactPhone;
    }

    if (selectedContact?.contactMail) {
      documentData.contactEmail = selectedContact.contactMail;
    }

    //!here 3 done
    if (isReceipt) {
      documentData.sendWithInvoices = sendWithInvoices;
    }

    if (messageType !== null) {
      if (isSendOrderReadyToClient) {
        await sendOrderReadyToClientApi(callApi, callBack, documentData);
      } else {
        await sendDocumentToClientApi(callApi, callBack, {
          documentType,
          document: documentData,
        });
      }
    }

    if (payState?.sendByWhatsapp) {
      handleSendUsingWhatsAppWeb(sendWithInvoices);
    }
  };

  const resendFromPrintHouseMail = async (
    messageType: MessageType,
    isSendOrderReadyToClient = false
  ) => {
    const callBack = (res) => {
      if (res?.success) {
        alertSuccessSend();
        onClickClosePaymentModal();
      } else {
        if (res?.errors?.message === "printHouse_mail_not_verified") {
          showAlertModal({
            message: t("alerts.printHouseMailNotVerified"),
          });
        } else {
          alertFaultSend();
        }
      }
    };

    const documentData: any = {
      [isSendOrderReadyToClient ? "orderId" : "documentId"]:
        payState?.documentId,
      messageType,
      sendMailIfNotVerifiedAgent: true,
    };

    if (isSendOrderReadyToClient) {
      await sendOrderReadyToClientApi(callApi, callBack, documentData);
    } else {
      await sendDocumentToClientApi(callApi, callBack, {
        documentType,
        document: documentData,
      });
    }
  };

  return (
    <GoMakeModal
      insideStyle={classes.insideStyle}
      openModal={openPaymentModal}
      onClose={onClickClosePaymentModal}
      modalTitle={
        isSendToClient
          ? t(
              `sales.quote.${
                isSendOrderReadyToClient
                  ? "sendOrderReadyToClientTitle"
                  : "sendToClient"
              }`
            )
          : paymentModalTitle
      }
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
        {isSendToClient &&
          PaymentInputs(payState)
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
        {!isSendToClient &&
          PaymentInputs(payState)
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
        <Stack
          direction={"row"}
          gap={"10px"}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          {!isReceipt && (
            <SecondaryButton
              variant="contained"
              onClick={
                isSendToClient
                  ? () => onClickSendQuoteToClient(isSendOrderReadyToClient)
                  : handleSendPaymentPage
              }
              style={{ width: "50%", height: "35px", minWidth: "fit-content" }}
            >
              {isSendToClient
                ? t("sales.quote.sendToClient")
                : t("prePayment.sendPaymentPage")}
            </SecondaryButton>
          )}

          {isReceipt && (
            <>
              <SecondaryButton
                variant="contained"
                onClick={
                  isSendToClient
                    ? () =>
                        onClickSendQuoteToClient(isSendOrderReadyToClient, true)
                    : handleSendPaymentPage
                }
                style={{
                  width: "50%",
                  height: "35px",
                  minWidth: "fit-content",
                }}
              >
                {t("sales.modals.sendWithInvoices")}
              </SecondaryButton>
              <SecondaryButton
                variant="outlined"
                onClick={
                  isSendToClient
                    ? () => onClickSendQuoteToClient(isSendOrderReadyToClient)
                    : handleSendPaymentPage
                }
                style={{
                  width: "50%",
                  height: "35px",
                  minWidth: "fit-content",
                }}
              >
                {t("sales.modals.sendWithoutInvoices")}
              </SecondaryButton>
            </>
          )}

          {!isSendToClient && (
            <SecondaryButton
              variant="outlined"
              onClick={handleCopyPaymentLink}
              style={{ width: "30%", height: "35px", minWidth: "fit-content" }}
            >
              {t("prePayment.copyPaymentLink")}
            </SecondaryButton>
          )}
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
