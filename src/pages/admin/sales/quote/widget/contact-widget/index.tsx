import { GoMakeAutoComplate, GomakeTextInput } from "@/components";
import { useStyle } from "./style";
import { useTranslation } from "react-i18next";
import { IconButton, Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useState } from "react";
import { AddContactWidget } from "./add-contact-widget";
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
  const mockData = [1];
  const [isAddNewContactWidget, setIsAddNewContactWidget] = useState(false);
  return (
    <>
      {mockData?.map((item, index) => {
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
                />
              </div>
            )}

            {isEmail && (
              <div style={clasess.fieldContainer}>
                <div style={clasess.labelStyle}>{t("sales.quote.email")}</div>
                <GomakeTextInput
                  placeholder={t("sales.quote.email")}
                  style={clasess.textInputStyle}
                />
              </div>
            )}
            {isAddNewContact && (
              <div style={clasess.fieldContainer}>
                <div style={clasess.labelStyle}></div>
                <div style={clasess.addDeleteContainer}>
                  {index === mockData?.length - 1 ? (
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
                    {mockData?.length > 1 ? (
                      <Tooltip title={t("sales.quote.removeContact")}>
                        <IconButton>
                          <RemoveIcon style={{ color: "#2E3092" }} />
                        </IconButton>
                      </Tooltip>
                    ) : null}
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
