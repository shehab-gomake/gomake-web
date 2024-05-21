import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";

import {
  GoMakeAutoComplate,
  GoMakeModal,
  GomakePrimaryButton,
  GomakeTextInput,
} from "@/components";

import { useStyle } from "./style";

const WhatsAppWebModal = ({
  openModal,
  onClose,
  clientContactsValue,
  getWhatsAppMessage,
  whatsappMassage
}) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const [, setSelectedClient] = useState<any>()
  const [phoneNumber, setPhoneNumber] = useState("")
  useEffect(() => {
    getWhatsAppMessage()
  }, [openModal])
  return (
    <>
      <GoMakeModal
        openModal={openModal}
        onClose={() => {
          onClose()
          setPhoneNumber("")
          setSelectedClient({})
        }}
        insideStyle={clasess.insideStyle}
      >
        <div style={clasess.mainContainer}>
          <GoMakeAutoComplate
            options={clientContactsValue}
            getOptionLabel={(option: any) => `${option.name}`}
            style={clasess.textInputStyle}
            placeholder={t("sales.quote.contactName")}
            onChange={(e, value) => {
              setSelectedClient(value)
              setPhoneNumber(value?.phone)
            }}
          />
          <GomakeTextInput
            placeholder={t("sales.quote.phone")}
            style={clasess.textInputStyle}
            value={phoneNumber}
            onChange={(e: any) => {
              setPhoneNumber(e.target.value)
            }}
          />
          <GomakePrimaryButton style={clasess.btnContainer} onClick={() => {
            if (whatsappMassage) {
              window.open(`whatsapp://send?phone=${phoneNumber}&text=${whatsappMassage}`, "_blank");

            }
          }}>
            {t("sales.quote.openWhatsAppWeb")}
          </GomakePrimaryButton>
        </div>
      </GoMakeModal>
    </>
  );
};
export { WhatsAppWebModal };
