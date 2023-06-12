import { GoMakeAutoComplate, GomakeTextInput } from "@/components";
import { useStyle } from "./style";
import { useTranslation } from "react-i18next";
import { IconButton, Tooltip } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import { useRecoilState } from "recoil";
import { clientContactsState } from "@/store";
import { useState } from "react";
interface IProps {
  isContactID?: boolean;
  isContactName?: boolean;
  isPortable?: boolean;
  isEmail?: boolean;
  isAddNewContact?: boolean;
  isAddNewContactWidget?: boolean;
  setIsAddNewContactWidget?: any;
}
const AddContactWidget = ({
  isContactID = true,
  isContactName = true,
  isPortable = true,
  isEmail = true,
  isAddNewContact = true,
  setIsAddNewContactWidget,
}: IProps) => {
  const { clasess } = useStyle();
  const { t } = useTranslation();
  const [clientContactsValue] = useRecoilState<any>(clientContactsState);
  const [selectedContactId, setSelectedContactId] = useState<any>();
  console.log("selectedContactId", selectedContactId);

  return (
    <div style={clasess.mainContainer}>
      {isContactID && (
        <div style={clasess.fieldContainer}>
          <div style={clasess.labelStyle}>{t("sales.quote.contactID")}</div>
          <GoMakeAutoComplate
            options={clientContactsValue}
            style={clasess.autoComplateStyle}
            placeholder={t("sales.quote.contactID")}
            getOptionLabel={(item) => item?.name}
            onChange={(e: any, item: any) => {
              setSelectedContactId(item);
            }}
          />
        </div>
      )}
      {isContactName && (
        <div style={clasess.fieldContainer}>
          <div style={clasess.labelStyle}>{t("sales.quote.contactName")}</div>
          <GomakeTextInput
            placeholder={t("sales.quote.contactName")}
            style={clasess.textInputStyle}
            value={selectedContactId?.name}
          />
        </div>
      )}
      {isPortable && (
        <div style={clasess.fieldContainer}>
          <div style={clasess.labelStyle}>{t("sales.quote.portable")}</div>
          <GomakeTextInput
            placeholder={t("sales.quote.portable")}
            style={clasess.textInputStyle}
            value={selectedContactId?.phone}
          />
        </div>
      )}

      {isEmail && (
        <div style={clasess.fieldContainer}>
          <div style={clasess.labelStyle}>{t("sales.quote.email")}</div>
          <GomakeTextInput
            placeholder={t("sales.quote.email")}
            style={clasess.textInputStyle}
            value={selectedContactId?.mail}
          />
        </div>
      )}
      {isAddNewContact && (
        <div style={clasess.fieldContainer}>
          <div style={clasess.labelStyle}></div>

          <div style={clasess.addDeleteContainer}>
            <Tooltip title={t("sales.quote.saveContact")}>
              <IconButton>
                <CheckIcon style={{ color: "#ED028C" }} />
              </IconButton>
            </Tooltip>

            <Tooltip title={t("sales.quote.closeContact")}>
              <IconButton onClick={() => setIsAddNewContactWidget(false)}>
                <CloseIcon style={{ color: "#2E3092" }} />
              </IconButton>
            </Tooltip>
          </div>
        </div>
      )}
    </div>
  );
};

export { AddContactWidget };
