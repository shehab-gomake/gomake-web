import { useStyle } from "./style";
import { PlusNewIcon } from "@/icons";
import { ContactMapping } from "./contact-mapping";
import { AddContactNewWidget } from "./add-contact-widget";
import { GoMakeDeleteModal } from "@/components";
import { useTranslation } from "react-i18next";
import { useUserPermission } from "@/hooks/use-permission";
import { DocumentPermission } from "@/components/CheckPermission/enum";

const ContactNewWidget = ({
  handleShowLess,
  items,
  displayedItems,
  setIsDisplayWidget,
  onOpenDeleteModalContact,
  changeItems,
  updateClientContact,
  setIsUpdateContactName,
  isUpdateContactMobile,
  setIsUpdateContactMobile,
  isUpdateContactEmail,
  setIsUpdateContactEmail,
  handleShowMore,
  isDisplayWidget,
  clientContactsValue,
  onBlurContactName,
  setSelectedContactById,
  selectedContactById,
  onBlurContactMobile,
  onInputChangePhone,
  onBlurContactEmail,
  onInputChangeMail,
  onClickAddNewContact,
  openDeleteModalContact,
  onCloseDeleteModalContact,
  onClickDeleteContact,
  selectedContact,
  isQuoteConfirmation = false,
  documentType,
  getQuote,
  getAllClientContacts,
  onOpenNewContact,
  documentState
}) => {
  const { classes } = useStyle();
  const { t } = useTranslation();
  const {CheckDocumentPermission } = useUserPermission();
  const canEditDocument = documentState?.isEditable && CheckDocumentPermission(documentType, DocumentPermission.EDIT_DOCUMENT);
  
  return (
    <>
      <div style={classes.mainContainer}>
        {items?.length > 0 ? (
          <>
            <div>
              {items?.slice(0, displayedItems).map((item, index) => (
                <ContactMapping
                  canEditContacts={canEditDocument}
                  key={`${index}-${item.id}`}
                  item={item}
                  index={index}
                  setIsDisplayWidget={setIsDisplayWidget}
                  displayedItems={displayedItems}
                  onOpenDeleteModalContact={onOpenDeleteModalContact}
                  items={items}
                  changeItems={changeItems}
                  updateClientContact={updateClientContact}
                  isQuoteConfirmation={isQuoteConfirmation}
                  clientContactsValue={clientContactsValue}
                  onOpenNewContact={onOpenNewContact}
                />
              ))}
            </div>
          </>
        ) : (
          (!isQuoteConfirmation && canEditDocument) &&
          <div
            style={classes.addNewContactNameStyle}
            onClick={() => setIsDisplayWidget(true)}
          >
            <PlusNewIcon />
            <div style={classes.addNewContactNameTextStyle}>
              {t("sales.quote.addContact")}
            </div>
          </div>
        )}
        {items?.length > 2 && displayedItems === 2 && (
          <div style={classes.showLessContainer} onClick={handleShowMore}>
            {t("sales.quote.showMore")}
          </div>
        )}
        {items?.length > 2 && displayedItems > 2 && (
          <div style={classes.showLessContainer} onClick={handleShowLess}>
            {t("sales.quote.showLess")}
          </div>
        )}
      </div>
      {isDisplayWidget && (
        <AddContactNewWidget
          clientContactsValue={clientContactsValue}
          onBlurContactName={onBlurContactName}
          setIsUpdateContactName={setIsUpdateContactName}
          setSelectedContactById={setSelectedContactById}
          selectedContactById={selectedContactById}
          onBlurContactMobile={onBlurContactMobile}
          isUpdateContactMobile={isUpdateContactMobile}
          setIsUpdateContactMobile={setIsUpdateContactMobile}
          onInputChangePhone={onInputChangePhone}
          onBlurContactEmail={onBlurContactEmail}
          isUpdateContactEmail={isUpdateContactEmail}
          setIsUpdateContactEmail={setIsUpdateContactEmail}
          onInputChangeMail={onInputChangeMail}
          onClickAddNewContact={onClickAddNewContact}
          setIsDisplayWidget={setIsDisplayWidget}
          documentType={documentType}
          getQuote={getQuote}
          getAllClientContacts={getAllClientContacts}
          onOpenNewContact={onOpenNewContact}
        />
      )}

      <GoMakeDeleteModal
        title={t("sales.quote.deleteContactRow")}
        yesBtn={t("materials.buttons.delete")}
        openModal={openDeleteModalContact}
        onClose={onCloseDeleteModalContact}
        subTitle={t("sales.quote.subTitleDeleteContactRow")}
        onClickDelete={() => onClickDeleteContact(selectedContact)}
      />
    </>
  );
};

export { ContactNewWidget };
