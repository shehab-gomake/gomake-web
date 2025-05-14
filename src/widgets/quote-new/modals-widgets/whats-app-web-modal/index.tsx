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

//!here modal
const WhatsAppWebModal = ({
  openModal,
  onClose,
  getWhatsAppMessage,
  whatsappMassage,
  getWhatsAppMessageForReceipt,
  documentType,
}) => {
  const { t } = useTranslation();
  const { classes } = useStyle();
  const quoteItemValue = useRecoilValue<any>(quoteItemState);
  const [selectedClient, setSelectedClient] = useState<any>();
  const [phoneNumber, setPhoneNumber] = useState("");
  const { openWhatsAppWebLink } = useWhatsAppWeb();
  const { CheckPreferenceValue } = usePrintHousePreferences();
  const { primaryColor } = useGomakeTheme();

  const [selectedMethod, setSelectedMethod] = useState<null | boolean>(null);
  // true = web, false = desktop

  const handleWhatsAppClick = () => {
    if (selectedMethod === null) return;

    openWhatsAppWebLink(whatsappMassage, phoneNumber, selectedMethod);
  };

  useEffect(() => {
    if (openModal) {
      if (documentType === DOCUMENT_TYPE.receipt) {
        getWhatsAppMessageForReceipt();
      } else {
        getWhatsAppMessage();
      }
    }
  }, [openModal]);

  useEffect(() => {
    if (openModal) {
      const value = quoteItemValue?.documentContacts[0];
      setSelectedClient(value);
      setPhoneNumber(value?.contactPhone);
    }
  }, [openModal]);

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
            key={`select-client-${
              quoteItemValue?.documentContacts?.[0]?.id || "none"
            }`}
            options={quoteItemValue?.documentContacts}
            getOptionLabel={(option: any) => `${option.contactName}`}
            placeholder={t("sales.quote.contactName")}
            onChange={(e, value) => {
              setSelectedClient(value);
              setPhoneNumber("");
              setTimeout(() => {
                setPhoneNumber(value?.contactPhone || "");
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
