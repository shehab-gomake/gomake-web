import { useTranslation } from "react-i18next";
import { InputUpdatedValues } from "../input-updated-values";
import { useStyle } from "./style";
import { AddNewIcon, PlusNewIcon, WastebasketNew2 } from "@/icons";
import { IconButton, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import { PhoneInputUpdatedValues } from "../phone-input-updated-values";
import { useSnackBar } from "@/hooks";
import { isValidEmail, isValidPhoneNumber } from "@/utils/helpers";
import { AutoCompleteUpdatedValue } from "../auto-complete-updated";
import { EditUnderLineIcon } from "@/icons/edit-icon-under-line";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";

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
  clientContactsValue,
  onOpenNewContact,
  canEditContacts,
}) => {
  const { classes } = useStyle();
  const { alertFault } = useSnackBar();
  const { t } = useTranslation();
  const { secondColor, primarySecondaryBlend } = useGomakeTheme();
  const [isUpdateContactName, setIsUpdateContactName] = useState(null);
  const [isUpdateContactEmail, setIsUpdateContactEmail] = useState(null);
  const [isUpdateContactMobile, setIsUpdateContactMobile] = useState(null);
  const [isEditingContactName, setIsEditingContactName] = useState(false);
  const [originalContactName, setOriginalContactName] = useState(
    item.contactName
  );
  const [originalContactEmail, setOriginalContactEmail] = useState(
    item.contactMail
  );
  const [originalContactMobile, setOriginalContactMobile] = useState(
    item.contactPhone
  );

  const [contactEmail, setContactEmail] = useState(item.contactMail || "");

  const enterContactNameEditMode = () => {
    setOriginalContactName(item.contactName);
    setIsEditingContactName(true);
  };

  const enterEditContactMode = () => {
    setOriginalContactEmail(item.contactMail);
    setOriginalContactMobile(item.contactPhone);
  };

  const onBlurContactNameSelect = async () => {
    setIsUpdateContactName(null);
  };

  const onBlurContactEmail = async (item) => {
    let trimmedContactMail = item.contactMail;
    if (item.contactMail) {
      trimmedContactMail = item.contactMail.trim();
      changeItems(index, "contactMail", trimmedContactMail);
    }
    if (
      trimmedContactMail === "" &&
      trimmedContactMail !== originalContactEmail
    ) {
      //This case is similar to deleting the mail.
      await updateClientContact(item);
    } else if (!isValidEmail(trimmedContactMail) && trimmedContactMail !== "") {
      alertFault("alerts.invalidContactMail");
      changeItems(index, "contactMail", originalContactEmail);
    } else if (trimmedContactMail !== originalContactEmail) {
      await updateClientContact(item);
    }
    setIsUpdateContactEmail(null);
  };

  const onBlurContactMobile = async (item) => {
    if (
      item.contactPhone === "" &&
      item.contactPhone !== originalContactMobile
    ) {
      //This case is similar to deleting the phone.
      await updateClientContact(item);
    } else if (!isValidPhoneNumber(item.contactPhone)) {
      alertFault("alerts.invalidContactPhone");
      changeItems(index, "contactPhone", originalContactMobile);
    } else if (item.contactPhone !== originalContactMobile) {
      await updateClientContact(item);
    }
    setIsUpdateContactMobile(false);
  };

  const onBlurContactNameInput = async (item) => {
    if (!item.contactName) {
      alertFault("alerts.invalidContactName");
      changeItems(index, "contactName", originalContactName);
    } else if (item.contactName !== originalContactName) {
      await updateClientContact(item);
    }
    setIsEditingContactName(false);
  };

  useEffect(() => {
    setContactEmail(item.contactMail || "");
  }, [item.contactMail]);

  return (
    <div
      style={{
        ...classes.businessContainerStyle,
        marginBottom: !isQuoteConfirmation ? "0px" : 10,
      }}
    >
      <Stack direction={"row"} alignItems={"center"}>
        {isEditingContactName ? (
          <InputUpdatedValues
            value={item?.contactName}
            placeholder={
              item?.contactName
                ? item?.contactName
                : t("sales.quote.contactName")
            }
            label={t("sales.quote.contactName")}
            onBlur={() => onBlurContactNameInput(item)}
            isUpdate={canEditContacts}
            setIsUpdate={(value) => {
              if (value === null) {
                // Reset contact name to the original value
                changeItems(index, "contactName", originalContactName);
              }
              setIsUpdateContactName(value);
              setIsEditingContactName(value);
            }}
            onInputChange={(e: any) => {
              changeItems(index, "contactName", e);
            }}
          />
        ) : (
          <AutoCompleteUpdatedValue
            label={t("sales.quote.contactName")}
            value={item?.contactName}
            options={[
              { id: "new", text: t("sales.quote.addNewContact") },
              ...clientContactsValue.map((contact) => ({
                ...contact,
                value: contact.id,
                text: contact.name,
              })),
            ]}
            isUpdate={canEditContacts && isUpdateContactName}
            setIsUpdate={(value) => {
              if (isQuoteConfirmation) {
                setIsUpdateContactName(false);
              }
              setIsUpdateContactName(value);
            }}
            getOptionLabel={(item) => item.text}
            onBlur={() => onBlurContactNameSelect()}
            onChange={(e, value) => {
              if (value?.id === "new") {
                onOpenNewContact(true);
                setIsUpdateContactName(null);
              } else {
                updateClientContact({
                  ...item,
                  contactMail: value?.mail,
                  contactName: value?.name,
                  contactPhone: value?.phone,
                  contactID: value?.id,
                });
                setIsUpdateContactName(null);
              }
            }}
            renderOption={(props: any, option: any) => (
              <li
                {...props}
                style={{
                  ...props.style,
                  backgroundColor:
                    option.id === "new"
                      ? primarySecondaryBlend(300)
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
        )}
        {!isQuoteConfirmation && canEditContacts && !isEditingContactName && (
          <IconButton onClick={enterContactNameEditMode}>
            <EditUnderLineIcon
              stroke={`var(--theme-accent-color, ${secondColor(500)})`}
            />
          </IconButton>
        )}
      </Stack>
      <PhoneInputUpdatedValues
        key={item?.id}
        value={item?.contactPhone}
        placeholder={
          item?.contactPhone
            ? item?.contactPhone
            : t("sales.quote.noMobileContact")
        }
        label={t("sales.quote.mobileContact")}
        onBlur={() => onBlurContactMobile(item)}
        isUpdate={canEditContacts && isUpdateContactMobile}
        setIsUpdate={(value) => {
          if (isQuoteConfirmation) setIsUpdateContactMobile(null);
          else {
            if (value) {
              enterEditContactMode();
            }
            if (value === null) {
              changeItems(index, "contactPhone", originalContactMobile);
            }
            setIsUpdateContactMobile(value);
          }
        }}
        onInputChange={(e: any) => {
          changeItems(index, "contactPhone", e);
        }}
      />
      <InputUpdatedValues
        value={contactEmail}
        placeholder={contactEmail || t("sales.quote.noMail")}
        label={t("sales.quote.contactEmail")}
        onBlur={() =>
          onBlurContactEmail({ ...item, contactMail: contactEmail })
        }
        isUpdate={canEditContacts && isUpdateContactEmail}
        setIsUpdate={(value) => {
          if (isQuoteConfirmation) {
            setIsUpdateContactEmail(null);
          } else {
            if (value) {
              enterEditContactMode();
              setContactEmail(item.contactMail || "");
            }
            if (value === null) {
              setContactEmail(originalContactEmail); // reset locally
              changeItems(index, "contactMail", originalContactEmail);
            }
            setIsUpdateContactEmail(value);
          }
        }}
        onInputChange={(e: any) => {
          setContactEmail(e); // update local state only
        }}
      />
      {!isQuoteConfirmation && canEditContacts && (
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
              <PlusNewIcon color={secondColor(500)} />
              <div style={classes.addNewContactNameTextStyle}>
                {t("sales.quote.addContact")}
              </div>
            </div>
          )}
          {index === Math.min(displayedItems - 1, (items?.length || 0) - 1) &&
            items?.length > 1 && (
              <div
                style={classes.addNewContactNameStyle}
                onClick={() => setIsDisplayWidget(true)}
              >
                <PlusNewIcon color={secondColor(500)} />
                <div style={classes.addNewContactNameTextStyle}>
                  {t("sales.quote.addContact")}
                </div>
              </div>
            )}
        </div>
      )}
    </div>
  );
};

export { ContactMapping };
