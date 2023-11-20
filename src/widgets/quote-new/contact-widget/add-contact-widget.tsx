import { useStyle } from "./style";
import { useTranslation } from "react-i18next";
import { useRecoilState, useRecoilValue } from "recoil";
import { clientContactsState } from "@/store";
import { quoteState } from "@/pages-components/quote/store/quote";
import { InputUpdatedValues } from "../input-updated-values";

const AddContactNewWidget = () => {
  const { clasess } = useStyle();
  const { t } = useTranslation();
  const [clientContactsValue] = useRecoilState<any>(clientContactsState);
  return (
    <>
      {/* <div style={clasess.businessContainerStyle}>
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
    </div> */}
    </>
    // <div style={clasess.mainContainer}>
    //   {isContactID && (
    //     <div style={clasess.fieldContainer}>
    //       <div style={clasess.labelContainer}>
    //         <div style={clasess.labelStyle}>{t("sales.quote.contactID")}</div>

    //         <div
    //           onClick={() => quoteStateValue?.onOpenAddNewContactClient()}
    //           style={clasess.plusIconContainer}
    //         >
    //           <PlusIcon />
    //         </div>
    //       </div>
    //       <GoMakeAutoComplate
    //         options={clientContactsValue}
    //         style={clasess.autoComplateStyle}
    //         placeholder={t("sales.quote.contactID")}
    //         getOptionLabel={(item) => item?.name}
    //         onChange={(e: any, item: any) => {
    //           quoteStateValue.setSelectedContactById(item);
    //         }}
    //       />
    //     </div>
    //   )}
    //   {isContactName && (
    //     <div style={clasess.fieldContainer}>
    //       <div style={clasess.labelStyle}>{t("sales.quote.contactName")}</div>
    //       <GomakeTextInput
    //         placeholder={t("sales.quote.contactName")}
    //         style={clasess.textInputStyle}
    //         value={quoteStateValue.selectedContactById?.name}
    //         onChange={(e: any) => {
    //           quoteStateValue?.onChangeUpdateClientContact(
    //             "name",
    //             e.target.value
    //           );
    //         }}
    //       />
    //     </div>
    //   )}
    //   {isPortable && (
    //     <div style={clasess.fieldContainer}>
    //       <div style={clasess.labelStyle}>{t("sales.quote.portable")}</div>
    //       <GomakeTextInput
    //         placeholder={t("sales.quote.portable")}
    //         style={clasess.textInputStyle}
    //         value={quoteStateValue.selectedContactById?.phone}
    //         onChange={(e: any) => {
    //           quoteStateValue?.onChangeUpdateClientContact(
    //             "phone",
    //             e.target.value
    //           );
    //         }}
    //       />
    //     </div>
    //   )}

    //   {isEmail && (
    //     <div style={clasess.fieldContainer}>
    //       <div style={clasess.labelStyle}>{t("sales.quote.email")}</div>
    //       <GomakeTextInput
    //         placeholder={t("sales.quote.email")}
    //         style={clasess.textInputStyle}
    //         value={quoteStateValue.selectedContactById?.mail}
    //         onChange={(e: any) => {
    //           quoteStateValue?.onChangeUpdateClientContact(
    //             "mail",
    //             e.target.value
    //           );
    //         }}
    //       />
    //     </div>
    //   )}
    //   {isAddNewContact && (
    //     <div style={clasess.fieldContainer}>
    //       <div style={clasess.labelStyle}></div>

    //       <div style={clasess.addDeleteContainer}>
    //         <Tooltip title={t("sales.quote.saveContact")}>
    //           <IconButton
    //             onClick={() => quoteStateValue.onClickAddNewContact()}
    //           >
    //             <CheckIcon style={{ color: "#ED028C" }} />
    //           </IconButton>
    //         </Tooltip>

    //         <Tooltip title={t("sales.quote.closeContact")}>
    //           <IconButton
    //             onClick={() => quoteStateValue.onCloseIsAddNewContactWidget()}
    //           >
    //             <CloseIcon style={{ color: "#2E3092" }} />
    //           </IconButton>
    //         </Tooltip>
    //       </div>
    //     </div>
    //   )}
    // </div>
  );
};

export { AddContactNewWidget };
