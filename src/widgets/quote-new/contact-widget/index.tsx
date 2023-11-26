import { useStyle } from "./style";
import { PlusNewIcon } from "@/icons";
import { ContactMapping } from "./contact-mapping";
import { AddContactNewWidget } from "./add-contact-widget";
import { GoMakeDeleteModal } from "@/components";
import { useTranslation } from "react-i18next";

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
}) => {
  const { clasess } = useStyle();
  const { t } = useTranslation();
  return (
    <>
      <div style={clasess.mainContainer}>
        {items?.length > 0 ? (
          <>
            <div>
              {items?.slice(0, displayedItems).map((item, index) => (
                <ContactMapping
                  key={`${index}-${item.id}`}
                  item={item}
                  index={index}
                  setIsDisplayWidget={setIsDisplayWidget}
                  displayedItems={displayedItems}
                  onOpenDeleteModalContact={onOpenDeleteModalContact}
                  items={items}
                  changeItems={changeItems}
                  updateClientContact={updateClientContact}
                />
              ))}
            </div>
          </>
        ) : (
          <div
            style={clasess.addNewContactNameStyle}
            onClick={() => setIsDisplayWidget(true)}
          >
            <PlusNewIcon />
            <div style={clasess.addNewContactNameTextStyle}>
              {t("sales.quote.addContact")}
            </div>
          </div>
        )}
        {items?.length > 2 && displayedItems === 2 && (
          <div style={clasess.showLessContainer} onClick={handleShowMore}>
            {t("sales.quote.showMore")}
          </div>
        )}
        {items?.length > 2 && displayedItems > 2 && (
          <div style={clasess.showLessContainer} onClick={handleShowLess}>
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
