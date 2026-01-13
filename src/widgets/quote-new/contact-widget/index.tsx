import { useStyle } from "./style";
import { PlusNewIcon, SortIcon } from "@/icons";
import { ContactMapping } from "./contact-mapping";
import { AddContactNewWidget } from "./add-contact-widget";
import { GoMakeDeleteModal } from "@/components";
import { useTranslation } from "react-i18next";
import { useUserPermission } from "@/hooks/use-permission";
import { DocumentPermission } from "@/components/CheckPermission/enum";
import { useRouter } from "next/router";
import { ModalType } from "@/enums";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { quoteItemState } from "@/store/quote-item";
import { useRecoilState } from "recoil";
import { useEffect, useRef, useState } from "react";
import { updateDocumentContactsReorderApi } from "@/services/api-service/generic-doc/documents-api";
import { useGomakeAxios } from "@/hooks/use-gomake-axios";
import { useSnackBar } from "@/hooks";
import { CLIENT_TYPE } from "@/pages/customers/enums";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";

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
  contactsListRef,
  clientType,
}) => {
  const { classes } = useStyle();
  const { t } = useTranslation();
  const { callApi } = useGomakeAxios();
  const { alertFault } = useSnackBar();
  const { secondColor } = useGomakeTheme();
  const router = useRouter();
  const { CheckDocumentPermission } = useUserPermission();
  const [quoteItemValue, setQuoteItemValue] =
    useRecoilState<any>(quoteItemState);
  const canEditDocumentContacts = router.query.isNewCreation
    ? true
    : CheckDocumentPermission(documentType, DocumentPermission.EDIT_DOCUMENT);
  const [documentContacts, setDocumentContacts] = useState(items);
  useEffect(() => {
    setDocumentContacts(items);
  }, [items]);

  const updateDocumentContactsReorder = async (list) => {
    if (router.query.isNewCreation) {
      const updatedQuoteItemValue = { ...quoteItemValue };
      updatedQuoteItemValue.documentContacts = list;
      setQuoteItemValue(updatedQuoteItemValue);
    } else {
      const callBack = (res) => {
        if (res?.success) {
        } else {
        }
      };
      await updateDocumentContactsReorderApi(callApi, callBack, {
        documentType: documentType,
        documentId: quoteItemValue?.id,
        documentContacts: list,
      });
    }
  };
  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const newList: any = Array.from(documentContacts);
    const [removed] = newList.splice(result.source.index, 1);
    newList.splice(result.destination.index, 0, removed);
    const transformedArray = newList.map((item, index) => ({
      ...item,
      index: index + 1,
    }));

    setDocumentContacts(transformedArray);
    updateDocumentContactsReorder(transformedArray);
  };
  const addContactWidgetRef = useRef<HTMLDivElement>(null); // Create a ref

  useEffect(() => {
    if (isDisplayWidget && addContactWidgetRef.current) {
      addContactWidgetRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [isDisplayWidget]);

  return (
    <>
      <div style={classes.mainContainer}>
        {items?.length > 0 ? (
          <>
            <div ref={contactsListRef}>
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="droppable">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                      {documentContacts
                        ?.slice(0, displayedItems)
                        .sort((a, b) => a.index - b.index)
                        .map((item, index) => (
                          <Draggable
                            key={item.id}
                            draggableId={item.contactID ?? item.id}
                            index={index}
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 10,
                                  }}
                                >
                                  <SortIcon />
                                  <ContactMapping
                                    canEditContacts={canEditDocumentContacts}
                                    key={`${index}-${item.id}`}
                                    item={item}
                                    index={index}
                                    setIsDisplayWidget={setIsDisplayWidget}
                                    displayedItems={displayedItems}
                                    onOpenDeleteModalContact={
                                      onOpenDeleteModalContact
                                    }
                                    items={items}
                                    changeItems={changeItems}
                                    updateClientContact={updateClientContact}
                                    isQuoteConfirmation={isQuoteConfirmation}
                                    clientContactsValue={clientContactsValue}
                                    onOpenNewContact={onOpenNewContact}
                                  />
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </div>
          </>
        ) : (
          !isQuoteConfirmation &&
          canEditDocumentContacts && (
            <div
              style={classes.addNewContactNameStyle}
              onClick={() => {
                if (!quoteItemValue.client) {
                  alertFault(
                    `home.admin.${
                      clientType === CLIENT_TYPE.CUSTOMER
                        ? "pleaseSelectClient"
                        : "pleaseSelectSupplier"
                    }`
                  );
                  return;
                } else {
                  setIsDisplayWidget(true);
                }
              }}
            >
              <PlusNewIcon color={secondColor(500)} />
              <div style={classes.addNewContactNameTextStyle}>
                {t("sales.quote.addContact")}
              </div>
            </div>
          )
        )}
        {items?.length > 2 && displayedItems === 2 && (
          <span style={classes.showLessContainer} onClick={handleShowMore}>
            {/* {t("sales.quote.showMoreContacts")} {"⮟"} */}
            {t("sales.quote.showMoreContacts")} {"⇩"}
          </span>
        )}

        {items?.length > 2 && displayedItems > 2 && (
          <div style={classes.showLessContainer} onClick={handleShowLess}>
            {/* {t("sales.quote.showLessContacts")} {"⮝"} */}
            {t("sales.quote.showLessContacts")} {"⇧"}
          </div>
        )}
      </div>
      {isDisplayWidget && (
        <div ref={addContactWidgetRef}>
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
        </div>
      )}
      <GoMakeDeleteModal
        modalType={ModalType.DELETE}
        openModal={openDeleteModalContact}
        onClose={onCloseDeleteModalContact}
        onClickDelete={() => onClickDeleteContact(selectedContact)}
      />
    </>
  );
};

export { ContactNewWidget };
