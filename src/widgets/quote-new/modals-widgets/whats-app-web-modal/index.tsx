import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import {
  GoMakeAutoComplate,
  GoMakeModal,
  GomakePrimaryButton,
  GomakeTextInput,
} from "@/components";

import { useStyle } from "./style";
import { DOCUMENT_TYPE } from "@/pages-components/quotes/enums";
import { useWhatsAppWeb } from "@/pages-components/quote-new/use-whats-app-web";
import { usePrintHousePreferences } from "@/hooks/use-print-house-preferences";
import { EPreferences } from "@/enums/prefernces";
import { clearPhoneNumberPrefix } from "@/utils/helpers";
import { quoteItemState } from "@/store/quote-item";
import { useRecoilState } from "recoil";

const WhatsAppWebModal = ({
  openModal,
  onClose,
  clientContactsValue,
  getWhatsAppMessage,
  whatsappMassage,
  isWhatsAppWeb,
  getWhatsAppMessageForReceipt,
  documentType,
}) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const [, setSelectedClient] = useState<any>();
  const [phoneNumber, setPhoneNumber] = useState("");
  const { openWhatsAppWebLink } = useWhatsAppWeb();
  const {
    CheckPreferenceValue
  } = usePrintHousePreferences()
  useEffect(() => {
    if (openModal) {
      if (documentType === DOCUMENT_TYPE.receipt) {
        getWhatsAppMessageForReceipt();
      } else {
        getWhatsAppMessage();
      }
    }
  }, [openModal]);

  const handleWhatsAppClick = () => {
    //openWhatsAppWebLink(whatsappMassage, phoneNumber, isWhatsAppWeb);
    openWhatsAppWebLink(whatsappMassage, phoneNumber);
  };
  const [quoteItemValue, setQuoteItemValue] = useRecoilState<any>(quoteItemState);
  console.log("quoteItemValue", { quoteItemValue, clientContactsValue })

  return (
    <>
      <GoMakeModal
        openModal={openModal}
        onClose={() => {
          onClose();
          setPhoneNumber("");
          setSelectedClient({});
        }}
        insideStyle={clasess.insideStyle}
      >
        <div style={clasess.mainContainer}>
          <GoMakeAutoComplate
            options={quoteItemValue?.documentContacts}
            getOptionLabel={(option: any) => `${option.contactName}`}
            style={clasess.textInputStyle}
            placeholder={t("sales.quote.contactName")}
            onChange={(e, value) => {
              setSelectedClient(value);
              setPhoneNumber(value?.contactPhone);
            }}
          />
          <GomakeTextInput
            placeholder={t("sales.quote.phone")}
            style={clasess.textInputStyle}
            value={
              !CheckPreferenceValue(EPreferences.SHOW_PHONE_PREFIX)
                ? clearPhoneNumberPrefix(phoneNumber)
                : phoneNumber
            }
            onChange={(e: any) => {
              setPhoneNumber(e.target.value);
            }}
          />
          <GomakePrimaryButton
            style={clasess.btnContainer}
            onClick={handleWhatsAppClick}
          >
            {t(
              isWhatsAppWeb
                ? "sales.quote.openWhatsAppWeb"
                : "sales.quote.openWhatsAppApp"
            )}
          </GomakePrimaryButton>
        </div>
      </GoMakeModal>
    </>
  );
};
export { WhatsAppWebModal };
