import { useTranslation } from "react-i18next";
import {
  GoMakeAutoComplate,
  GoMakeModal,
  GomakePrimaryButton,
  GomakeTextInput,
} from "@/components";

import { useStyle } from "./style";
import { useState } from "react";

const WhatsAppWebModal = ({
  openModal,
  onClose,
  clientContactsValue
}) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const [selectedClinet, setSelectedClient] = useState<any>()
  const [phoneNumber, setPhoneNumber] = useState("")
  console.log("selectedClinet", { selectedClinet, phoneNumber })
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
            window.open(`whatsapp://send?phone=${phoneNumber}&text=hello`, "_blank");
          }}>
            {t("sales.quote.openWhatsAppWeb")}
          </GomakePrimaryButton>
        </div>
      </GoMakeModal>
    </>
  );
};
export { WhatsAppWebModal };
