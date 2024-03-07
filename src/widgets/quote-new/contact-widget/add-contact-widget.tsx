import { useTranslation } from "react-i18next";
import { InputUpdatedValues } from "../input-updated-values";
import { useStyle } from "./style";
import { AutoCompleteUpdatedValue } from "../auto-complete-updated";
import { GomakePrimaryButton } from "@/components";
import { WastebasketNew2 } from "@/icons";
import { IconButton } from "@mui/material";
import { PhoneInputUpdatedValues } from "../phone-input-updated-values";

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
  setIsDisplayWidget,
}) => {
  const { classes } = useStyle();
  const { t } = useTranslation();

  return (
    <>
      <div style={classes.businessContainerStyle}>
        <AutoCompleteUpdatedValue
          label={t("sales.quote.contactName")}
          options={clientContactsValue}
          onBlur={onBlurContactName}
          isUpdate={true}
          setIsUpdate={setIsUpdateContactName}
          getOptionLabel={(item) => item?.name}
          onChange={(e: any, item: any) => {
            setSelectedContactById(item);
          }}
        />
        <PhoneInputUpdatedValues
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
          style={classes.saveBtnStyle}
          onClick={onClickAddNewContact}
        >
          {t("materials.buttons.save")}
        </GomakePrimaryButton>
        <IconButton
          onClick={() => setIsDisplayWidget(false)}
          style={{ padding: 4 }}
        >
          <WastebasketNew2 />
        </IconButton>
      </div>
    </>
  );
};

export { AddContactNewWidget };