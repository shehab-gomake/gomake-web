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
import { emailRegex } from "@/utils/regex";
import { useRecoilValue } from "recoil";
import { printHouseHasFrontDeskFeature } from "@/store/print-house-profile";

interface ISendPaymentProps {
  openPaymentModal?: any;
  onClickClosePaymentModal?: any;
  paymentModalTitle?: any;
  documentType?: DOCUMENT_TYPE;
  isSendToClient?: boolean;
  isSendOrderReadyToClient?: boolean;
  showAlertModal: (params: { message: string; onConfirm?: () => void }) => void;
  hideCheckboxes?: boolean;
  preSelectedMethod?: "sms" | "whatsapp" | null;
}

const SendPaymentModal = ({
  openPaymentModal,
  onClickClosePaymentModal,
  paymentModalTitle,
  documentType,
  isSendToClient,
  isSendOrderReadyToClient,
  showAlertModal,
  hideCheckboxes = false,
  preSelectedMethod = null,
}: ISendPaymentProps) => {
  const { classes } = useStyle();
  const { alertFaultSend, alertSuccessSend, alertFault } = useSnackBar();
  const { callApi } = useGomakeAxios();
  const { getWhatsWebUrl, openWhatsAppWebLink } = useWhatsAppWeb();
  const isReceipt = documentType === DOCUMENT_TYPE.receipt;
  const hasFrontDeskFeature = useRecoilValue(printHouseHasFrontDeskFeature);

  const {
    t,
    payState,
    handleCopyPaymentLink,
    handleCheckBoxChange,
    onChangePaymentInputs,
    handleSendPaymentPage,
  } = useSendPaymentModal({ openPaymentModal, documentType });

  const handleSendUsingWhatsAppWeb = (sendWithInvoices = false) => {
    getWhatsAppMessageApi(
      callApi,
      (res) => {
        const selectedContact =
          payState?.documentContacts &&
          payState.documentContacts[payState?.selectedContactIndex];
        // const url = getWhatsWebUrl(res?.data, selectedContact?.contactPhone);
        // if (url) {
        //   window.open(url, "_blank");
        // }
        if (res.success)
          openWhatsAppWebLink(res?.data, selectedContact?.contactPhone, true);
        else alertFaultSend();
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

    const contactPhone =
      selectedContact?.contactPhone || payState.contactPhone || "";
    const contactMail =
      selectedContact?.contactMail || payState.contactMail || "";

    let messageType: MessageType | null = null;

    if (payState.sendByMail && payState.sendBySms) {
      messageType = MessageType.Both;
    } else if (payState.sendByMail) {
      messageType = MessageType.Email;
    } else if (payState.sendBySms) {
      messageType = MessageType.SMS;
    }

    if (messageType === null && !payState?.sendByWhatsapp) {
      alertFault(t("alerts.checkAtLeastOne"));
      return;
    }
    if (payState.sendByMail && !contactMail) {
      alertFault(t("alerts.noMail"));
      return;
    }
    if (!emailRegex.test(contactMail) && payState.sendByMail) {
      alertFault("customers.invalidEmail");
      return;
    }
    if ((payState.sendBySms || payState.sendByWhatsapp) && !contactPhone) {
      alertFault(t("alerts.noPhoneNumber"));
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
          } else if (res.errors.message === "app_password_required") {
            showAlertModal({
              message: t("alerts.app_password_required"),
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

    if (contactPhone) {
      documentData.contactPhone = contactPhone;
    }

    if (contactMail) {
      documentData.contactEmail = contactMail;
    }

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
            `sales.quote.${isSendOrderReadyToClient
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
        {!hideCheckboxes && !hasFrontDeskFeature && (
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
            {/* !here */}
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
        )}
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
                  : async () => {
                    const shouldSendWhatsApp = await handleSendPaymentPage();
                    if (shouldSendWhatsApp) {
                      handleSendUsingWhatsAppWeb(false);
                    }
                  }
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
                    : async () => {
                      const shouldSendWhatsApp =
                        await handleSendPaymentPage();
                      if (shouldSendWhatsApp) {
                        handleSendUsingWhatsAppWeb(true);
                      }
                    }
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
                    : async () => {
                      const shouldSendWhatsApp =
                        await handleSendPaymentPage();
                      if (shouldSendWhatsApp) {
                        handleSendUsingWhatsAppWeb(false);
                      }
                    }
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
