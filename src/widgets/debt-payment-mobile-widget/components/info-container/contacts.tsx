import { useStyle } from "./style";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useRecoilValue } from "recoil";
import { quoteConfirmationState } from "@/store";
import { ContactMapping } from "./contacts-mapping";

const ContactsWidget = () => {
  const { classes } = useStyle();
  const { t } = useTranslation();
  const quoteConfirm = useRecoilValue<any>(quoteConfirmationState);

  const item = {
    contactEmail: quoteConfirm.contactEmail,
    contactPhone: quoteConfirm.contactPhone,
    contactName: quoteConfirm.contactName,
  };

  return (
    <>
      <div style={classes.businessContainerStyle}>
        <div style={classes.mainContainer}>
          <ContactMapping item={item} />
        </div>
      </div>
    </>
  );
};

export { ContactsWidget };
