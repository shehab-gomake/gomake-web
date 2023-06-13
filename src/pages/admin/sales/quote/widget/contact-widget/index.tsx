import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";

import {
  GoMakeAutoComplate,
  GoMakeDeleteModal,
  GomakeTextInput,
} from "@/components";
import { AddPlusIcon, RemoveIcon } from "@/icons";
import { clientContactsState, quoteItemState } from "@/store";

import { AddContactWidget } from "./add-contact-widget";
import { useStyle } from "./style";
import { quoteState } from "../../store/quote";

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
  const { t } = useTranslation();
  const quoteStateValue = useRecoilValue<any>(quoteState);
  const quoteItemValue: any = useRecoilValue(quoteItemState);
  const [clientContactsValue] = useRecoilState<any>(clientContactsState);

  return (
    <>
      {quoteItemValue?.quoteContacts?.length > 0 ? (
        <>
          {quoteItemValue?.quoteContacts?.map((item: any, index: number) => {
            return (
              <div style={clasess.mainContainer}>
                {isContactID && (
                  <div style={clasess.fieldContainer}>
                    <div style={clasess.labelStyle}>
                      {t("sales.quote.contactID")}
                    </div>
                    <GoMakeAutoComplate
                      options={clientContactsValue}
                      style={clasess.autoComplateStyle}
                      placeholder={
                        clientContactsValue[index]?.name
                          ? clientContactsValue[index]?.name
                          : t("sales.quote.contactID")
                      }
                      getOptionLabel={(item) => item?.name}
                      // defaultValue={item?.contactName}
                      // value={item?.contactName}
                      // onChange={(e: any, item: any) => {
                      //   setSelectedContactId(item);
                      // }}
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
                      value={item?.contactName}
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
                                Add new contact
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
                        <div style={clasess.removeContactStyle}>Remove</div>
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
              <div style={clasess.addContactStyle}>Add new contact</div>
            </div>
          )}
        </>
      )}

      {quoteStateValue.isAddNewContactWidget && <AddContactWidget />}
      <GoMakeDeleteModal
        title={"Delete Contact row"}
        yesBtn={t("materials.buttons.delete")}
        openModal={quoteStateValue?.openDeleteModalContact}
        onClose={quoteStateValue?.onCloseDeleteModalContact}
        subTitle={"Are you sure to delete this row?"}
        onClickDelete={() =>
          quoteStateValue?.onClickDeleteContact(
            quoteStateValue?.selectedContact
          )
        }
      />
    </>
  );
};

export { ContactWidget };
