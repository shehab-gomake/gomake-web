import { useTranslation } from "react-i18next";
import { InputUpdatedValues } from "../input-updated-values";
import { useStyle } from "./style";
import { AutoCompleteUpdatedValue } from "../auto-complete-updated";
import { GomakePrimaryButton } from "@/components";

const AddContactNewWidget = ({
  clientContactsValue,
  onBlurContactName,
  setIsUpdateContactName,
  setSelectedContactById,
  selectedContactById,
  onBlurContactMobile,
  isUpdateContactMobile,
  setIsUpdateContactMobile,
  onInputChangePhone,
  onBlurContactEmail,
  isUpdateContactEmail,
  setIsUpdateContactEmail,
  onInputChangeMail,
  onClickAddNewContact,
}) => {
  const { clasess } = useStyle();
  const { t } = useTranslation();

  return (
    <>
      <div style={clasess.businessContainerStyle}>
        <AutoCompleteUpdatedValue
          label={t("sales.quote.contactName")}
          // value={selectedAgent?.text}
          options={clientContactsValue}
          onBlur={onBlurContactName}
          isUpdate={true}
          setIsUpdate={setIsUpdateContactName}
          getOptionLabel={(item) => item?.name}
          onChange={(e: any, item: any) => {
            setSelectedContactById(item);
          }}
        />

        <InputUpdatedValues
          value={
            selectedContactById?.phone !== null
              ? selectedContactById?.phone
              : t("sales.quote.noMobileContact")
          }
          label={t("sales.quote.mobileContact")}
          onBlur={onBlurContactMobile}
          isUpdate={isUpdateContactMobile}
          setIsUpdate={setIsUpdateContactMobile}
          onInputChange={onInputChangePhone}
        />
        <InputUpdatedValues
          value={
            selectedContactById?.mail !== null
              ? selectedContactById?.mail
              : t("sales.quote.noContactEmail")
          }
          label={t("sales.quote.contactEmail")}
          onBlur={onBlurContactEmail}
          isUpdate={isUpdateContactEmail}
          setIsUpdate={setIsUpdateContactEmail}
          onInputChange={onInputChangeMail}
        />
        <GomakePrimaryButton
          style={clasess.saveBtnStyle}
          onClick={onClickAddNewContact}
        >
          Save
        </GomakePrimaryButton>
      </div>
    </>
  );
};

export { AddContactNewWidget };
