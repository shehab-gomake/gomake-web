import { useTranslation } from "react-i18next";
import { InputUpdatedValues } from "../input-updated-values";
import { useStyle } from "./style";
import { AutoCompleteUpdatedValue } from "../auto-complete-updated";
import { GomakePrimaryButton } from "@/components";
import { WastebasketNew2 } from "@/icons";
import { IconButton } from "@mui/material";
import { PhoneInputUpdatedValues } from "../phone-input-updated-values";
import { useState } from "react";
import { addCustomerContactApi, addDocumentContactApi } from "@/services/api-service/generic-doc/documents-api";
import { useRecoilValue } from "recoil";
import { quoteItemState } from "@/store";
import { useGomakeAxios, useSnackBar } from "@/hooks";

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
  documentType,
  getQuote,
  getAllClientContacts,
  onOpenNewContact
}) => {
  const { classes } = useStyle();
  const { t } = useTranslation();
  const [newContactName, setNewContactName] = useState("")
  const quoteItemValue = useRecoilValue<any>(quoteItemState);
  const { callApi } = useGomakeAxios();
  const { alertSuccessAdded, alertFaultAdded } = useSnackBar();

  const addNewContactNew = async (contactID) => {
    const callBack = (res) => {
      if (res?.success) {
        alertSuccessAdded();
        setIsDisplayWidget(false);
        getQuote();
      } else {
        alertFaultAdded();
      }
    }
    await addDocumentContactApi(callApi, callBack, {
      documentType: documentType,
      contact:
      {
        contactID: contactID,
        contactName: newContactName,
        contactMail: selectedContactById?.mail,
        contactPhone: selectedContactById?.phone,
        documentID: quoteItemValue?.id,
      }
    })
  }

  const createNewContactNew = async () => {
    const callBack = (res) => {
      if (res?.success) {
        alertSuccessAdded();
        setIsDisplayWidget(false);
        getQuote();
        getAllClientContacts()
        addNewContactNew(res?.data?.data?.data)
      } else {
        alertFaultAdded();
      }
    }
    await addCustomerContactApi(callApi, callBack, {
      contactName: newContactName,
      contactMail: selectedContactById?.mail,
      contactPhone: selectedContactById?.phone,
      clientId: quoteItemValue?.customerID,
    })
  }
  const onClickAddNewContactNew = () => {
    if (newContactName) {
      createNewContactNew()
    }
    else {
      onClickAddNewContact()
    }
  }

  return (
    <>
      <div style={classes.businessContainerStyle}>
        <AutoCompleteUpdatedValue
          label={t("sales.quote.contactName")}
          options={[
            { id: 'new', text: t("sales.quote.addNewContact") }, // Add New Contact option
            ...clientContactsValue.map(contact => ({
              ...contact,
              value: contact.id,
              text: contact.name
            }))
          ]}
          onBlur={onBlurContactName}
          isUpdate={true}
          setIsUpdate={setIsUpdateContactName}
          getOptionLabel={(item) => item.text}
          onChange={(e: any, item: any) => {
            if (item?.id === 'new') {
              onOpenNewContact(true)
              setIsDisplayWidget(false)
            } else {
              setSelectedContactById(item);
            }
          }}
          onChangeTextField={
            (e) => setNewContactName(e.target.value)
          }
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
          onClick={onClickAddNewContactNew}
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