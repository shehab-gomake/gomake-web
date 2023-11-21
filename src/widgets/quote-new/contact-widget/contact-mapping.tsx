import { useTranslation } from "react-i18next";
import { InputUpdatedValues } from "../input-updated-values";
import { useStyle } from "./style";
import { PlusNewIcon, WastebasketNew2 } from "@/icons";
import { IconButton } from "@mui/material";
import { useState } from "react";

const ContactMapping = ({
  item,
  index,
  setIsDisplayWidget,
  displayedItems,
  onOpenDeleteModalContact,
  items,
  changeItems,
  updateClientContact,
}) => {
  const { clasess } = useStyle();
  const { t } = useTranslation();
  const [isUpdateContactName, setIsUpdateContactName] = useState(null);
  const [isUpdateContactEmail, setIsUpdateContactEmail] = useState(null);
  const [isUpdateContactMobile, setIsUpdateContactMobile] = useState(null);
  const onBlurContactName = async (item) => {
    updateClientContact(item);
    setIsUpdateContactName(null);
  };
  const onBlurContactEmail = async (item) => {
    updateClientContact(item);
    setIsUpdateContactEmail(null);
  };
  const onBlurContactMobile = async (item) => {
    updateClientContact(item);
    setIsUpdateContactMobile(null);
  };
  return (
    <div style={clasess.businessContainerStyle}>
      <InputUpdatedValues
        value={
          item?.contactName !== null ? item?.contactName : "No contact name"
        }
        label={t("sales.quote.contactName")}
        onBlur={() => onBlurContactName(item)}
        isUpdate={isUpdateContactName}
        setIsUpdate={setIsUpdateContactName}
        onInputChange={(e: any) => {
          changeItems(index, "contactName", e);
        }}
      />
      <InputUpdatedValues
        value={
          item?.contactPhone !== null ? item?.contactPhone : "No mobile contact"
        }
        label={t("sales.quote.mobileContact")}
        onBlur={() => onBlurContactMobile(item)}
        isUpdate={isUpdateContactMobile}
        setIsUpdate={setIsUpdateContactMobile}
        onInputChange={(e: any) => {
          changeItems(index, "contactPhone", e);
        }}
      />
      <InputUpdatedValues
        value={
          item?.contactMail !== null ? item?.contactMail : "No contact mail"
        }
        label={t("sales.quote.contactEmail")}
        onBlur={() => onBlurContactEmail(item)}
        isUpdate={isUpdateContactEmail}
        setIsUpdate={setIsUpdateContactEmail}
        onInputChange={(e: any) => {
          changeItems(index, "contactMail", e);
        }}
      />
      <div style={clasess.addDeleteContainer}>
        <IconButton
          onClick={() => onOpenDeleteModalContact(item)}
          style={{ padding: 4 }}
        >
          <WastebasketNew2 />
        </IconButton>
        {index === 0 && items?.length === 1 && (
          <div
            style={clasess.addNewContactNameStyle}
            onClick={() => setIsDisplayWidget(true)}
          >
            <PlusNewIcon />
            <div style={clasess.addNewContactNameTextStyle}>Add Contact</div>
          </div>
        )}
        {index === displayedItems - 1 && (
          <div
            style={clasess.addNewContactNameStyle}
            onClick={() => setIsDisplayWidget(true)}
          >
            <PlusNewIcon />
            <div style={clasess.addNewContactNameTextStyle}>Add Contact</div>
          </div>
        )}
      </div>
    </div>
  );
};

export { ContactMapping };
