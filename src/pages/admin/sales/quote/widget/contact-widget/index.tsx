import { useTranslation } from "react-i18next";
import { useRecoilState, useRecoilValue } from "recoil";

import {
  GoMakeAutoComplate,
  GoMakeDeleteModal,
  GomakeTextInput,
} from "@/components";
import { clientContactsState, quoteItemState } from "@/store";
import { AddPlusIcon, RemoveIcon } from "@/icons";

import { AddContactWidget } from "./add-contact-widget";
import { quoteState } from "../../store/quote";
import { useStyle } from "./style";

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
    </>
  );
};

export { ContactWidget };
