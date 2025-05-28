import { GomakePrimaryButton } from "@/components";
import { FONT_FAMILY } from "@/utils/font-family";
import { Stack } from "@mui/material";
import { useStyle } from "../style";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { DOCUMENT_TYPE } from "@/pages-components/quotes/enums";
import cloneDeep from "lodash/cloneDeep";
import { PrimaryCheckbox } from "@/components/check-box/primary-check-box";
import { MessageType } from "@/pages-components/quote-new/use-quote";
import { PrimaryButton } from "@/components/button/primary-button";

enum MessageTypes {
  EMAIL = "email",
  PHONE = "phone",
  WHATSAPP_WEB = "WhatsAppWeb",
}

interface SendInvoiceSectionProps {
  handleSendDocument: (value: any, value2?: any) => void;
  handleSendUsingWhatsAppWeb: (includeInvoices?: boolean) => void;
  docType: DOCUMENT_TYPE;
  openReceiptModal?: any;
}

const SendInvoiceSection: React.FC<SendInvoiceSectionProps> = ({
  handleSendDocument,
  handleSendUsingWhatsAppWeb,
  docType,
  openReceiptModal,
}) => {
  const { t } = useTranslation();
  const { classes } = useStyle();

  const [selectedOptions, setSelectedOptions] = useState<MessageTypes[]>([
    MessageTypes.EMAIL,
    MessageTypes.PHONE,
  ]);

  const addSendingOptions = (type: MessageTypes) => {
    let currentlySelectedOptions = cloneDeep(selectedOptions);
    if (checkIfOptionSelected(type)) {
      currentlySelectedOptions = currentlySelectedOptions.filter(
        (x) => x !== type
      );
    } else {
      currentlySelectedOptions.push(type);
    }
    setSelectedOptions(currentlySelectedOptions);
  };

  const checkIfOptionSelected = (type: MessageTypes) => {
    if (selectedOptions.includes(type)) {
      return true;
    }
    return false;
  };

  const isReceipt = docType === DOCUMENT_TYPE.receipt;
  const isEmailSelected = checkIfOptionSelected(MessageTypes.EMAIL);
  const isPhoneSelected = checkIfOptionSelected(MessageTypes.PHONE);
  const isWhatsAppSelected = checkIfOptionSelected(MessageTypes.WHATSAPP_WEB);

  const sendMessage = () => {
    if (isWhatsAppSelected) {
      if (isReceipt)
        openReceiptModal((includeInvoices) => {
          handleSendUsingWhatsAppWeb(includeInvoices);
        });
      else handleSendUsingWhatsAppWeb();
    }
    if (isReceipt && (isEmailSelected || isPhoneSelected)) {
      // Use the receipt modal flow for receipts
      openReceiptModal((includeInvoices) => {
        if (isEmailSelected && isPhoneSelected) {
          handleSendDocument(MessageType.Both, includeInvoices);
        } else if (isEmailSelected) {
          handleSendDocument(MessageType.Email, includeInvoices);
        } else if (isPhoneSelected) {
          handleSendDocument(MessageType.SMS, includeInvoices);
        }
      });
    } else {
      // For other document types
      if (isEmailSelected && isPhoneSelected) {
        handleSendDocument(MessageType.Both);
      } else if (isEmailSelected) {
        handleSendDocument(MessageType.Email);
      } else if (isPhoneSelected) {
        handleSendDocument(MessageType.SMS);
      }
    }
  };

  const getSendButtonText = () => {
    switch (docType) {
      case DOCUMENT_TYPE.deliveryNote:
        return t("sales.modals.sendDeliveryNote");
      case DOCUMENT_TYPE.invoice:
        return t("sales.modals.sendInvoice");
      case DOCUMENT_TYPE.receipt:
        return t("sales.modals.sendReceipt");
      default:
        return t("sales.modals.sendDocument");
    }
  };

  return (
    <Stack direction={"column"} gap={"10px"} width={"100%"}>
      <span style={classes.sectionTitle}>{getSendButtonText()}</span>
      <Stack direction={"row"} gap={"10px"} width={"100%"}>
        <Stack direction={"row"} width={"100%"} alignItems={"center"}>
          <PrimaryCheckbox
            checked={checkIfOptionSelected(MessageTypes.EMAIL)}
            onChange={() => addSendingOptions(MessageTypes.EMAIL)}
          />
          <span
            style={{
              ...classes.sectionTitle,
              ...FONT_FAMILY.Inter(500, 15),
            }}
          >
            {t("sales.modals.email")}
          </span>
        </Stack>
        <Stack direction={"row"} width={"100%"} alignItems={"center"}>
          <PrimaryCheckbox
            checked={checkIfOptionSelected(MessageTypes.PHONE)}
            onChange={() => addSendingOptions(MessageTypes.PHONE)}
          />
          <span
            style={{
              ...classes.sectionTitle,
              ...FONT_FAMILY.Inter(500, 14),
            }}
          >
            {t("sales.modals.phoneNumber")}
          </span>
        </Stack>
        <Stack direction={"row"} width={"100%"} alignItems={"center"}>
          <PrimaryCheckbox
            checked={checkIfOptionSelected(MessageTypes.WHATSAPP_WEB)}
            onChange={() => addSendingOptions(MessageTypes.WHATSAPP_WEB)}
          />
          <span
            style={{
              ...classes.sectionTitle,
              ...FONT_FAMILY.Inter(500, 14),
            }}
          >
            {t("sales.quote.whatsAppWeb")}
          </span>
        </Stack>
      </Stack>
      <PrimaryButton
        variant="contained"
        style={{
          width: "100%",
          borderRadius: "8px",
          height: "40px",
        }}
        onClick={() => sendMessage()}
        disabled={!isWhatsAppSelected && !isEmailSelected && !isPhoneSelected}
      >
        {t("sales.modals.send")}
      </PrimaryButton>
    </Stack>
  );
};

export { SendInvoiceSection };
