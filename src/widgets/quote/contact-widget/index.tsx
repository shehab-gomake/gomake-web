import {
  GoMakeAutoComplate,
  GoMakeDeleteModal,
  GomakeTextInput,
} from "@/components";
import { AddPlusIcon, PlusIcon, RemoveIcon } from "@/icons";

import { AddContactWidget } from "./add-contact-widget";
import { useStyle } from "./style";

import { useContactWidget } from "./use-contact-widget";
import { AddNewContactModal } from "../modals-widgets/add-contact-modal";

interface IProps {
  isContactID?: boolean;
  isContactName?: boolean;
  isPortable?: boolean;
  isEmail?: boolean;
  isAddNewContact?: boolean;
}
const ContactWidget = ({
  isContactID = true,
  isContactName = true,
  isPortable = true,
  isEmail = true,
  isAddNewContact = true,
}: IProps) => {
  const { clasess } = useStyle();
  const {
    quoteStateValue,
    quoteItemValue,
    clientContactsValue,
    items,
    changeItems,
    updateClientContact,
    t,
  } = useContactWidget();

  return (
    <div>
      {items?.length > 0 ? (
        <>
          {items?.map((item: any, index: number) => {
            return (
              <div style={clasess.mainContainer}>
                {isContactID && (
                  <div style={clasess.fieldContainer}>
                    <div style={clasess.labelContainer}>
                      <div style={clasess.labelStyle}>
                        {t("sales.quote.contactID")}
                      </div>
                      {index === 0 ? (
                        <div
                          onClick={() =>
                            quoteStateValue?.onOpenAddNewContactClient()
                          }
                          style={clasess.plusIconContainer}
                        >
                          <PlusIcon />
                        </div>
                      ) : null}
                    </div>
                    <GoMakeAutoComplate
                      options={clientContactsValue}
                      style={clasess.autoComplateStyle}
                      placeholder={
                        item?.contactID
                          ? item?.contactName
                          : t("sales.quote.contactID")
                      }
                      getOptionLabel={(item) => item?.name}
                      disabled={true}
                    />
                  </div>
                )}

                {isContactName && (
                  <div style={clasess.fieldContainer}>
                    <div style={clasess.labelStyle}>
                      {t("sales.quote.contactName")}
                    </div>
                    <GomakeTextInput
                      placeholder={t("sales.quote.contactName")}
                      style={clasess.textInputStyle}
                      value={item?.contactName || ""}
                      onChange={(e: any) => {
                        changeItems(index, "contactName", e.target.value);
                      }}
                      onBlur={() => updateClientContact(item)}
                    />
                  </div>
                )}
                {isPortable && (
                  <div style={clasess.fieldContainer}>
                    <div style={clasess.labelStyle}>
                      {t("sales.quote.portable")}
                    </div>
                    <GomakeTextInput
                      placeholder={t("sales.quote.portable")}
                      style={clasess.textInputStyle}
                      value={item?.contactPhone}
                      onChange={(e: any) => {
                        changeItems(index, "contactPhone", e.target.value);
                      }}
                      onBlur={() => updateClientContact(item)}
                    />
                  </div>
                )}

                {isEmail && (
                  <div style={clasess.fieldContainer}>
                    <div style={clasess.labelStyle}>
                      {t("sales.quote.email")}
                    </div>
                    <GomakeTextInput
                      placeholder={t("sales.quote.email")}
                      style={clasess.textInputStyle}
                      value={item?.contactMail}
                      onChange={(e: any) => {
                        changeItems(index, "contactMail", e.target.value);
                      }}
                      onBlur={() => updateClientContact(item)}
                    />
                  </div>
                )}
                {isAddNewContact && (
                  <div style={clasess.fieldContainer}>
                    <div style={clasess.labelStyle}></div>
                    <div style={clasess.addDeleteContainer}>
                      {index === quoteItemValue?.quoteContacts?.length - 1 ? (
                        <div>
                          {!quoteStateValue.isAddNewContactWidget && (
                            <div
                              style={clasess.addContactContainer}
                              onClick={() =>
                                quoteStateValue.setIsAddNewContactWidget(true)
                              }
                            >
                              <AddPlusIcon stroke={"#090A1D"} />
                              <div style={clasess.addContactStyle}>
                                {t("sales.quote.addNewContact")}
                              </div>
                            </div>
                          )}
                        </div>
                      ) : null}
                      <div
                        style={clasess.addContactContainer}
                        onClick={() =>
                          quoteStateValue?.onOpenDeleteModalContact(item)
                        }
                      >
                        <RemoveIcon />
                        <div style={clasess.removeContactStyle}>
                          {t("sales.quote.remove")}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </>
      ) : (
        <>
          {!quoteStateValue.isAddNewContactWidget && (
            <div
              style={clasess.addContactContainer}
              onClick={() => quoteStateValue.setIsAddNewContactWidget(true)}
            >
              <AddPlusIcon stroke={"#090A1D"} />
              <div style={clasess.addContactStyle}>
                {t("sales.quote.addNewContact")}
              </div>
            </div>
          )}
        </>
      )}

      {quoteStateValue.isAddNewContactWidget && <AddContactWidget />}
      <GoMakeDeleteModal
        title={t("sales.quote.deleteContactRow")}
        yesBtn={t("materials.buttons.delete")}
        openModal={quoteStateValue?.openDeleteModalContact}
        onClose={quoteStateValue?.onCloseDeleteModalContact}
        subTitle={t("sales.quote.subTitleDeleteContactRow")}
        onClickDelete={() =>
          quoteStateValue?.onClickDeleteContact(
            quoteStateValue?.selectedContact
          )
        }
      />
      <AddNewContactModal />
    </div>
  );
};

export { ContactWidget };
