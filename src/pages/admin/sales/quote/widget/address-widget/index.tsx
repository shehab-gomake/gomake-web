import { GoMakeAutoComplate, GomakeTextInput } from "@/components";
import { useStyle } from "./style";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { IconButton, Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { AddAddressWidget } from "./add-address-widget";
import { useRecoilValue } from "recoil";
import { quoteItemState } from "@/store";
interface IProps {
  isAddressID?: boolean;
  isCity?: boolean;
  isStreet?: boolean;
  isEntrance?: boolean;
  isApartment?: boolean;
  isAddNewAddress?: boolean;
}
const AddressWidget = ({
  isAddressID = true,
  isCity = true,
  isStreet = true,
  isEntrance = true,
  isApartment = true,
  isAddNewAddress = true,
}: IProps) => {
  const { clasess } = useStyle();
  const { t } = useTranslation();
  const quoteItemValue: any = useRecoilValue(quoteItemState);
  const [isAddNewContactWidget, setIsAddNewContactWidget] = useState(false);

  return (
    <>
      {quoteItemValue?.quoteAddresses?.map((item, index) => {
        return (
          <div style={clasess.mainContainer}>
            {isAddressID && (
              <div style={clasess.fieldContainer}>
                <div style={clasess.labelStyle}>
                  {t("sales.quote.addressID")}
                </div>
                <GoMakeAutoComplate
                  options={["A", "B", "C", "D", "E", "F"]}
                  style={clasess.autoComplateStyle}
                  placeholder={t("sales.quote.addressID")}
                />
              </div>
            )}

            {isCity && (
              <div style={clasess.fieldContainer}>
                <div style={clasess.labelStyle}>{t("sales.quote.city")}</div>
                <GoMakeAutoComplate
                  options={["A", "B", "C", "D", "E", "F"]}
                  style={clasess.autoComplateStyle}
                  placeholder={t("sales.quote.city")}
                />
              </div>
            )}

            {isStreet && (
              <div style={clasess.fieldContainer}>
                <div style={clasess.labelStyle}>{t("sales.quote.street")}</div>
                <GoMakeAutoComplate
                  options={["A", "B", "C", "D", "E", "F"]}
                  style={clasess.autoComplateStyle}
                  placeholder={t("sales.quote.street")}
                />
              </div>
            )}

            {isEntrance && (
              <div style={clasess.fieldContainer}>
                <div style={clasess.labelStyle}>
                  {t("sales.quote.entrance")}
                </div>
                <GoMakeAutoComplate
                  options={["A", "B", "C", "D", "E", "F"]}
                  style={clasess.autoComplateStyle}
                  placeholder={t("sales.quote.entrance")}
                />
              </div>
            )}

            {isApartment && (
              <div style={clasess.fieldContainer}>
                <div style={clasess.labelStyle}>
                  {t("sales.quote.apartment")}
                </div>
                <GomakeTextInput
                  placeholder={t("sales.quote.apartment")}
                  style={clasess.textInputStyle}
                />
              </div>
            )}
            {isAddNewAddress && (
              <div style={clasess.fieldContainer}>
                <div style={clasess.labelStyle} />
                <div style={clasess.addDeleteContainer}>
                  {index === quoteItemValue?.quoteAddresses?.length - 1 ? (
                    <div>
                      {!isAddNewContactWidget && (
                        <Tooltip title={t("sales.quote.addNewAddress")}>
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
        <AddAddressWidget
          isAddNewContactWidget={isAddNewContactWidget}
          setIsAddNewContactWidget={setIsAddNewContactWidget}
        />
      )}
    </>
  );
};

export { AddressWidget };
