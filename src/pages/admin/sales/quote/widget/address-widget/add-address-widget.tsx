import { GoMakeAutoComplate, GomakeTextInput } from "@/components";
import { useStyle } from "./style";
import { useTranslation } from "react-i18next";
import { IconButton, Tooltip } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import { useRecoilState, useRecoilValue } from "recoil";
import { quoteState } from "../../store/quote";
import { clientAddressState } from "@/store";
interface IProps {
  isAddressID?: boolean;
  isCity?: boolean;
  isStreet?: boolean;
  isEntrance?: boolean;
  isApartment?: boolean;
  isAddNewAddress?: boolean;
}

const AddAddressWidget = ({
  isAddressID = true,
  isCity = true,
  isStreet = true,
  isEntrance = true,
  isApartment = true,
  isAddNewAddress = true,
}: IProps) => {
  const { clasess } = useStyle();
  const { t } = useTranslation();
  const quoteStateValue = useRecoilValue<any>(quoteState);
  const [clientAddressValue] = useRecoilState<any>(clientAddressState);
  return (
    <div style={clasess.mainContainer}>
      {isAddressID && (
        <div style={clasess.fieldContainer}>
          <div style={clasess.labelStyle}>{t("sales.quote.addressID")}</div>
          <GoMakeAutoComplate
            options={clientAddressValue}
            style={clasess.autoComplateStyle}
            placeholder={t("sales.quote.addressID")}
            getOptionLabel={(item) => item?.street}
            onChange={(e: any, item: any) => {
              quoteStateValue.setSelectedAddressById(item);
            }}
          />
        </div>
      )}

      {isCity && (
        <div style={clasess.fieldContainer}>
          <div style={clasess.labelStyle}>{t("sales.quote.city")}</div>
          <GomakeTextInput
            placeholder={t("sales.quote.city")}
            style={clasess.textInputStyle}
            value={quoteStateValue.selectedAddressById?.city}
            onChange={(e: any) => {
              quoteStateValue?.onChangeUpdateClientAddress(
                "city",
                e.target.value
              );
            }}
          />
        </div>
      )}

      {isStreet && (
        <div style={clasess.fieldContainer}>
          <div style={clasess.labelStyle}>{t("sales.quote.street")}</div>
          <GomakeTextInput
            placeholder={t("sales.quote.street")}
            style={clasess.textInputStyle}
            value={quoteStateValue.selectedAddressById?.street}
            onChange={(e: any) => {
              quoteStateValue?.onChangeUpdateClientAddress(
                "street",
                e.target.value
              );
            }}
          />
        </div>
      )}

      {isEntrance && (
        <div style={clasess.fieldContainer}>
          <div style={clasess.labelStyle}>{t("sales.quote.entrance")}</div>
          <GomakeTextInput
            placeholder={t("sales.quote.entrance")}
            style={clasess.textInputStyle}
            value={quoteStateValue.selectedAddressById?.street}
            onChange={(e: any) => {
              quoteStateValue?.onChangeUpdateClientAddress(
                "entrance",
                e.target.value
              );
            }}
          />
        </div>
      )}

      {isApartment && (
        <div style={clasess.fieldContainer}>
          <div style={clasess.labelStyle}>{t("sales.quote.apartment")}</div>
          <GomakeTextInput
            placeholder={t("sales.quote.apartment")}
            style={clasess.textInputStyle}
            value={quoteStateValue.selectedAddressById?.apartment}
            onChange={(e: any) => {
              quoteStateValue?.onChangeUpdateClientAddress(
                "apartment",
                e.target.value
              );
            }}
          />
        </div>
      )}
      {isAddNewAddress && (
        <div style={clasess.fieldContainer}>
          <div style={clasess.labelStyle}></div>

          <div style={clasess.addDeleteContainer}>
            <Tooltip title={t("sales.quote.saveContact")}>
              <IconButton
                onClick={() => quoteStateValue.onClickAddNewAddress()}
              >
                <CheckIcon style={{ color: "#ED028C" }} />
              </IconButton>
            </Tooltip>

            <Tooltip title={t("sales.quote.closeContact")}>
              <IconButton
                onClick={() => quoteStateValue.onCloseIsAddNewAddressWidget()}
              >
                <CloseIcon style={{ color: "#2E3092" }} />
              </IconButton>
            </Tooltip>
          </div>
        </div>
      )}
    </div>
  );
};

export { AddAddressWidget };
