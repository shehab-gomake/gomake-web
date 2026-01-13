import { useTranslation } from "react-i18next";
import { InputUpdatedValues } from "../input-updated-values";
import { useStyle } from "./style";
import { AutoCompleteUpdatedValue } from "../auto-complete-updated";
import { GomakePrimaryButton } from "@/components";
import { AddNewIcon, WastebasketNew2 } from "@/icons";
import { IconButton } from "@mui/material";
import { PhoneInputUpdatedValues } from "../phone-input-updated-values";
import { useState } from "react";
import {
  addCustomerContactApi,
  addDocumentContactApi,
} from "@/services/api-service/generic-doc/documents-api";
import { useRecoilState } from "recoil";
import { quoteItemState } from "@/store";
import { useGomakeAxios, useSnackBar } from "@/hooks";
import { useRouter } from "next/router";
import { v4 as uuidv4 } from "uuid";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";

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
  onOpenNewContact,
}) => {
  const { classes } = useStyle();
  const { t } = useTranslation();
  const [newContactName, setNewContactName] = useState("");
  const [quoteItemValue, setQuoteItemValue] =
    useRecoilState<any>(quoteItemState);
  const router = useRouter();
  const isNewCreation = router.query.isNewCreation === "true";
  const { callApi } = useGomakeAxios();
  const { primarySecondaryBlend } = useGomakeTheme();
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
    };
    await addDocumentContactApi(callApi, callBack, {
      documentType: documentType,
      contact: {
        contactID: contactID,
        contactName: newContactName,
        contactMail: selectedContactById?.mail,
        contactPhone: selectedContactById?.phone,
        documentID: quoteItemValue?.id,
      },
    });
  };

  const createNewContactNew = async () => {
    const callBack = (res) => {
      if (res?.success) {
        alertSuccessAdded();
        setIsDisplayWidget(false);
        getQuote();
        getAllClientContacts();
        addNewContactNew(res?.data?.data?.data);
      } else {
        alertFaultAdded();
      }
    };
    await addCustomerContactApi(callApi, callBack, {
      contactName: newContactName,
      contactMail: selectedContactById?.mail,
      contactPhone: selectedContactById?.phone,
      clientId: quoteItemValue?.customerID,
    });
  };
  // Save contact directly with the contact item (avoids state timing issues)
  const saveContactDirectly = async (contactItem: any) => {
    if (isNewCreation) {
      const updatedQuoteItemValue = { ...quoteItemValue };
      if (!Array.isArray(updatedQuoteItemValue.documentContacts)) {
        updatedQuoteItemValue.documentContacts = [];
      }
      const newContact = {
        id: uuidv4(),
        contactID: contactItem?.id,
        contactName: contactItem?.name,
        contactMail: contactItem?.mail,
        contactPhone: contactItem?.phone,
        documentID: quoteItemValue?.id,
      };
      updatedQuoteItemValue.documentContacts = [
        ...updatedQuoteItemValue.documentContacts,
        newContact,
      ];
      setQuoteItemValue(updatedQuoteItemValue);
      setIsDisplayWidget(false);
    } else {
      const callBack = (res) => {
        if (res?.success) {
          alertSuccessAdded();
          setIsDisplayWidget(false);
          getQuote();
        } else {
          alertFaultAdded();
        }
      };
      await addDocumentContactApi(callApi, callBack, {
        documentType: documentType,
        contact: {
          contactID: contactItem?.id,
          contactName: contactItem?.name,
          contactMail: contactItem?.mail,
          contactPhone: contactItem?.phone,
          documentID: quoteItemValue?.id,
        },
      });
    }
  };

  const onClickAddNewContactNew = () => {
    if (newContactName) {
      createNewContactNew();
    } else {
      onClickAddNewContact();
    }
  };
  const filteredContacts = clientContactsValue.filter(
    (contact) =>
      !quoteItemValue?.documentContacts?.some(
        (docContact) => docContact.contactID === contact.id
      )
  );
  return (
    <>
      <div style={classes.businessContainerStyle}>
        <AutoCompleteUpdatedValue
          label={t("sales.quote.contactName")}
          options={[
            { id: "new", text: t("sales.quote.addNewContact") }, // Add New Contact option
            ...filteredContacts.map((contact) => ({
              ...contact,
              value: contact.id,
              text: contact.name,
            })),
          ]}
          onBlur={onBlurContactName}
          isUpdate={true}
          setIsUpdate={setIsUpdateContactName}
          getOptionLabel={(item) => item.text}
          onChange={(e: any, item: any) => {
            if (item?.id === "new") {
              onOpenNewContact(true);
              setIsDisplayWidget(false);
            } else {
              // Set selected contact for UI display
              setSelectedContactById(item);
              // Automatically save directly with the contact item (avoids state timing issues)
              saveContactDirectly(item);
            }
          }}
          onChangeTextField={(e) => setNewContactName(e.target.value)}
          renderOption={(props: any, option: any) => (
            <li
              {...props}
              style={{
                ...props.style,
                backgroundColor:
                  option.id === "new"
                    ? primarySecondaryBlend(500)
                    : "transparent",
                color: option.id === "new" ? "white" : "inherit",
                fontWeight: option.id === "new" ? "500" : "normal",
                minWidth: 200,
                gap: 10,
              }}
            >
              <AddNewIcon color="white" />
              {option.text}
            </li>
          )}
          filterOptions={(options, state) => {
            const filtered = options.filter((opt) =>
              opt.text?.toLowerCase().includes(state.inputValue.toLowerCase())
            );

            const addNewOption = options.find((opt) => opt.id === "new");
            if (addNewOption && !filtered.some((opt) => opt.id === "new")) {
              filtered.push(addNewOption);
            }

            return filtered;
          }}
        />
        <PhoneInputUpdatedValues
          value={selectedContactById?.phone}
          placeholder={
            selectedContactById?.phone
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
          value={selectedContactById?.mail}
          placeholder={
            selectedContactById?.mail
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
