import { GoMakeAutoComplate, GomakeTextInput } from "@/components";
import { useStyle } from "./style";
import { useTranslation } from "react-i18next";
import { IconButton, Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

import { useState } from "react";
import { AddContactWidget } from "./add-contact-widget";
import { useRecoilValue } from "recoil";
import { quoteItemState } from "@/store";

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
  const quoteItemValue: any = useRecoilValue(quoteItemState);
  const [isAddNewContactWidget, setIsAddNewContactWidget] = useState(false);
  return (
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
                  options={["A", "B", "C", "D", "E", "F"]}
                  style={clasess.autoComplateStyle}
                  placeholder={t("sales.quote.contactID")}
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
                <div style={clasess.labelStyle}>{t("sales.quote.email")}</div>
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
                      {!isAddNewContactWidget && (
                        <Tooltip title={t("sales.quote.addNewContact")}>
                          <IconButton
                            onClick={() => setIsAddNewContactWidget(true)}
                          >
                            <AddIcon style={{ color: "#ED028C" }} />
                          </IconButton>
                        </Tooltip>
                      )}
                    </div>
                  ) : null}
                  <div>
                    <Tooltip title={t("sales.quote.removeContact")}>
                      <IconButton>
                        <DeleteIcon style={{ color: "#2E3092" }} />
                      </IconButton>
                    </Tooltip>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
      {isAddNewContactWidget && (
        <AddContactWidget
          isAddNewContactWidget={isAddNewContactWidget}
          setIsAddNewContactWidget={setIsAddNewContactWidget}
        />
      )}
    </>
  );
};

export { ContactWidget };
