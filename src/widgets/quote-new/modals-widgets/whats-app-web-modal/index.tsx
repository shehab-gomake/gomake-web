import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { GoMakeModal } from "@/components";
import { useStyle } from "./style";
import { DOCUMENT_TYPE } from "@/pages-components/quotes/enums";
import { useWhatsAppWeb } from "@/pages-components/quote-new/use-whats-app-web";
import { usePrintHousePreferences } from "@/hooks/use-print-house-preferences";
import { EPreferences } from "@/enums/prefernces";
import { clearPhoneNumberPrefix } from "@/utils/helpers";
import { quoteItemState } from "@/store/quote-item";
import { useRecoilValue } from "recoil";
import { FormControlLabel, Radio, RadioGroup } from "@mui/material";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { PrimaryButton } from "@/components/button/primary-button";
import { GoMakeTextInput } from "@/components/text-input/go-make-text-input";
import { GoMakeSelect } from "@/components/auto-complete/go-make-select";

interface IWhatsAppWebModalProps {
  openModal: boolean;
  onClose: () => void;
  getWhatsAppMessage?: () => void;
  whatsappMassage: string;
  getWhatsAppMessageForReceipt?: () => void;
  documentType: any;
  clientContacts?: any[];
}

const WhatsAppWebModal = ({
  openModal,
  onClose,
  getWhatsAppMessage,
  whatsappMassage,
  getWhatsAppMessageForReceipt,
  documentType,
  clientContacts = null, // For aging report and other non-quote flows
}: IWhatsAppWebModalProps) => {
  const { t } = useTranslation();
  const { classes } = useStyle();
  const quoteItemValue = useRecoilValue<any>(quoteItemState);
  const [selectedClient, setSelectedClient] = useState<any>();
  const [phoneNumber, setPhoneNumber] = useState("");
  const { openWhatsAppWebLink } = useWhatsAppWeb();
  const { CheckPreferenceValue } = usePrintHousePreferences();
  const { primaryColor } = useGomakeTheme();

  // Use clientContacts if provided (for aging report), otherwise use quoteItemValue
  const contacts = clientContacts || quoteItemValue?.documentContacts;

  const [selectedMethod, setSelectedMethod] = useState<null | boolean>(null);
  // true = web, false = desktop

  const handleWhatsAppClick = () => {
    if (selectedMethod === null) return;

    openWhatsAppWebLink(whatsappMassage, phoneNumber, selectedMethod);
  };

  useEffect(() => {
    if (openModal) {
      if (
        documentType === DOCUMENT_TYPE.receipt &&
        getWhatsAppMessageForReceipt
      ) {
        getWhatsAppMessageForReceipt();
      } else if (getWhatsAppMessage) {
        getWhatsAppMessage();
      }
      // If neither function is provided, the message should already be set (e.g., from aging report)
    }
  }, [openModal, documentType]);

  useEffect(() => {
    if (openModal && contacts && contacts.length > 0) {
      const value = contacts[0];
      setSelectedClient(value);
      // Handle both contactPhone (quote) and phone (aging report) formats
      const phone = value?.contactPhone || value?.phone || "";
      setPhoneNumber(phone);
    }
  }, [openModal, contacts]);

  useEffect(() => {
    if (openModal) {
      const savedMethod = localStorage.getItem("whatsappMethod");
      if (savedMethod !== null) {
        setSelectedMethod(savedMethod === "true");
      }
    }
  }, [openModal]);

  return (
    <>
      <GoMakeModal
        modalTitle={t("sales.modals.sendViaWhatsApp")}
        modalTitleStyle={classes.modalTitle}
        openModal={openModal}
        onClose={() => {
          onClose();
          setPhoneNumber("");
          setSelectedClient({});
        }}
        insideStyle={classes.insideStyle}
      >
        <div style={classes.mainContainer}>
          <GoMakeSelect
            key={`select-client-${contacts?.[0]?.id || "none"}`}
            options={contacts}
            getOptionLabel={(option: any) => {
              // Handle both contactName (quote) and label (aging report) formats
              return option.contactName || option.label || option.name || "";
            }}
            placeholder={t("sales.quote.contactName")}
            onChange={(e, value) => {
              setSelectedClient(value);
              setPhoneNumber("");
              setTimeout(() => {
                // Handle both contactPhone (quote) and phone (aging report) formats
                const phone = value?.contactPhone || value?.phone || "";
                setPhoneNumber(phone);
              }, 0);
            }}
            value={selectedClient}
          />
          <GoMakeTextInput
            placeholder={t("sales.quote.phone")}
            value={
              !CheckPreferenceValue(EPreferences.SHOW_PHONE_PREFIX)
                ? clearPhoneNumberPrefix(phoneNumber)
                : phoneNumber
            }
            onChange={(e: any) => {
              setPhoneNumber(e.target.value);
            }}
          />
          <div
            style={{
              display: "flex",
              gap: 24,
              alignItems: "center",
            }}
          >
            <RadioGroup
              row
              value={selectedMethod}
              onChange={(e) => {
                const method = e.target.value === "true";
                setSelectedMethod(method);
                localStorage.setItem("whatsappMethod", String(method));
              }}
            >
              <FormControlLabel
                value={true}
                control={<Radio style={{ color: primaryColor(500) }} />}
                label={t("sales.modals.whatsappWeb")}
              />
              <FormControlLabel
                value={false}
                control={<Radio style={{ color: primaryColor(500) }} />}
                label={t("sales.modals.whatsappDesktop")}
              />
            </RadioGroup>
          </div>

          <PrimaryButton
            variant="contained"
            style={classes.btnContainer}
            onClick={handleWhatsAppClick}
            disabled={selectedMethod === null}
          >
            {t("sales.modals.openWhatsApp")}
          </PrimaryButton>
        </div>
      </GoMakeModal>
    </>
  );
};
export { WhatsAppWebModal };
