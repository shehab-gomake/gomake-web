import { useTranslation } from "react-i18next";
import { InputUpdatedValues } from "../input-updated-values";
import { useStyle } from "./style";
import { useState } from "react";
import {
  AddPlusIcon,
  PlusNewIcon,
  RemoveIcon,
  WastebasketNew,
  WastebasketNew2,
} from "@/icons";
import { useRecoilValue } from "recoil";
import { quoteItemState } from "@/store";
import { IconButton } from "@mui/material";

const ContactMapping = ({ item, index }) => {
  const { clasess } = useStyle();
  const { t } = useTranslation();
  const quoteItemValue: any = useRecoilValue(quoteItemState);

  const [isUpdateContactName, setIsUpdateContactName] = useState<number | null>(
    null
  );
  const [isUpdateContactEmail, setIsUpdateContactEmail] = useState<
    number | null
  >(null);
  const [isUpdateContactMobile, setIsUpdateContactMobile] = useState<
    number | null
  >(null);
  const onBlurContactName = async () => {
    setIsUpdateContactName(null);
  };
  const onBlurContactEmail = async () => {
    setIsUpdateContactEmail(null);
  };
  const onBlurContactMobile = async () => {
    setIsUpdateContactMobile(null);
  };

  return (
    <div style={clasess.businessContainerStyle}>
      <InputUpdatedValues
        value={item?.contactName}
        label={t("sales.quote.contactName")}
        onBlur={onBlurContactName}
        isUpdate={isUpdateContactName}
        setIsUpdate={setIsUpdateContactName}
      />
      <InputUpdatedValues
        value={
          item?.contactPhone !== null ? item?.contactPhone : "No mobile contact"
        }
        label={t("sales.quote.mobileContact")}
        onBlur={onBlurContactMobile}
        isUpdate={isUpdateContactMobile}
        setIsUpdate={setIsUpdateContactMobile}
      />
      <InputUpdatedValues
        value={
          item?.contactMail !== null ? item?.contactMail : "No contact email"
        }
        label={t("sales.quote.contactEmail")}
        onBlur={onBlurContactEmail}
        isUpdate={isUpdateContactEmail}
        setIsUpdate={setIsUpdateContactEmail}
      />
      <div style={clasess.addDeleteContainer}>
        <IconButton>
          <WastebasketNew2 />
        </IconButton>
        {index === quoteItemValue?.quoteContacts?.length - 1 && (
          <div style={clasess.addNewContactNameStyle}>
            <PlusNewIcon />
            <div style={clasess.addNewContactNameTextStyle}>Add Contact</div>
          </div>
        )}
      </div>
    </div>
  );
};

export { ContactMapping };
