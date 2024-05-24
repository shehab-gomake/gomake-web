import { useTranslation } from "react-i18next";
import { InputUpdatedValues } from "../input-updated-values";
import { useStyle } from "./style";
import { PlusNewIcon, WastebasketNew2 } from "@/icons";
import { IconButton } from "@mui/material";
import { useState } from "react";
import { PhoneInputUpdatedValues } from "../phone-input-updated-values";
import { useSnackBar } from "@/hooks";
import { isValidEmail, isValidPhoneNumber } from "@/utils/helpers";
import { AutoCompleteUpdatedValue } from "../auto-complete-updated";

const ContactMapping = ({
  item,
  index,
  setIsDisplayWidget,
  displayedItems,
  onOpenDeleteModalContact,
  items,
  changeItems,
  updateClientContact,
  isQuoteConfirmation = false,
  clientContactsValue
}) => {
  const { classes } = useStyle();
  const { alertFault } = useSnackBar();
  const { t } = useTranslation();
  const [isUpdateContactName, setIsUpdateContactName] = useState(null);
  const [isUpdateContactEmail, setIsUpdateContactEmail] = useState(null);
  const [isUpdateContactMobile, setIsUpdateContactMobile] = useState(null);
  const [isConfirmation, setIsConfirmation] = useState(null);

  const onBlurContactName = async (item) => {
    if (!item.contactName) {
      alertFault("login.thisFieldRequired")
    }
    else {
      updateClientContact(item);
      setIsUpdateContactName(null);
    }

  };
  const onBlurContactEmail = async (item) => {
    if (!item.contactMail || !isValidEmail(item.contactMail)) {
      alertFault("Invalid email address format or missing contact email")
    }
    else {
      updateClientContact(item);
      setIsUpdateContactEmail(null);
    }

  };
  const onBlurContactMobile = async (item) => {
    if (!item.contactPhone || !isValidPhoneNumber(item.contactPhone)) {
      alertFault("Phone number must be in the format +1234567890 and have a minimum length of 10 digits")
    }
    else {
      updateClientContact(item);
      setIsUpdateContactMobile(null);
    }
  };
  return (
    <div style={classes.businessContainerStyle}>
      <AutoCompleteUpdatedValue
        label={t("sales.quote.contactName")}
        value={item?.contactName}
        options={clientContactsValue.map(contanct => ({
          ...contanct,
          value: contanct.id,
          text: contanct.name
        }))}
        onBlur={() => null}
        isUpdate={isUpdateContactName}
        setIsUpdate={isQuoteConfirmation ? setIsConfirmation : setIsUpdateContactName}
        getOptionLabel={(item) => item.text}
        onChange={(e, value) => {
          updateClientContact({
            ...item,
            contactMail: value?.mail,
            contactName: value?.name,
            contactPhone: value?.phone
          })
          setIsUpdateContactName(null);
        }}
      />

      {/* <InputUpdatedValues
        value={
          item?.contactName !== null ? item?.contactName : t("sales.quote.noName")
        }
        label={t("sales.quote.contactName")}
        onBlur={() => onBlurContactName(item)}
        isUpdate={isUpdateContactName}
        setIsUpdate={isQuoteConfirmation ? setIsConfirmation : setIsUpdateContactName}
        onInputChange={(e: any) => {
          changeItems(index, "contactName", e);
        }}
      /> */}
      <PhoneInputUpdatedValues
        key={item?.id}
        value={
          item?.contactPhone !== null ? item?.contactPhone : t("sales.quote.noMobileContact")
        }
        label={t("sales.quote.mobileContact")}
        onBlur={() => onBlurContactMobile(item)}
        isUpdate={isUpdateContactMobile}
        setIsUpdate={isQuoteConfirmation ? setIsConfirmation : setIsUpdateContactMobile}
        onInputChange={(e: any) => {
          changeItems(index, "contactPhone", e);
        }} />
      <InputUpdatedValues
        value={
          item?.contactMail !== null ? item?.contactMail : t("sales.quote.noMail")
        }
        label={t("sales.quote.contactEmail")}
        onBlur={() => onBlurContactEmail(item)}
        isUpdate={isUpdateContactEmail}
        setIsUpdate={isQuoteConfirmation ? setIsConfirmation : setIsUpdateContactEmail}
        onInputChange={(e: any) => {
          changeItems(index, "contactMail", e);
        }}
      />
      {!isQuoteConfirmation &&
        <div style={classes.addDeleteContainer}>
          <IconButton
            onClick={() => onOpenDeleteModalContact(item)}
            style={{ padding: 4 }}
          >
            <WastebasketNew2 />
          </IconButton>
          {index === 0 && items?.length === 1 && (
            <div
              style={classes.addNewContactNameStyle}
              onClick={() => setIsDisplayWidget(true)}
            >
              <PlusNewIcon />
              <div style={classes.addNewContactNameTextStyle}>{t("sales.quote.addContact")}</div>
            </div>
          )}
          {index === displayedItems - 1 && (
            <div
              style={classes.addNewContactNameStyle}
              onClick={() => setIsDisplayWidget(true)}
            >
              <PlusNewIcon />
              <div style={classes.addNewContactNameTextStyle}>{t("sales.quote.addContact")}</div>
            </div>
          )}
        </div>}
    </div>
  );
};

export { ContactMapping };
