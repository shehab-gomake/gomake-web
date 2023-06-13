import { GoMakeAutoComplate, GomakeTextInput } from "@/components";
import { useStyle } from "./style";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { IconButton, Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { AddAddressWidget } from "./add-address-widget";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  clientAddressState,
  clientContactsState,
  quoteItemState,
} from "@/store";
import { AddPlusIcon, RemoveIcon } from "@/icons";
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
  const [clientAddressValue] = useRecoilState<any>(clientAddressState);
  return (
    <>
      {quoteItemValue?.quoteAddresses?.length > 0 ? (
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
                      options={clientAddressValue}
                      getOptionLabel={(item) => item?.street}
                      style={clasess.autoComplateStyle}
                      placeholder={
                        clientAddressValue[index]?.street
                          ? clientAddressValue[index]?.street
                          : t("sales.quote.addressID")
                      }
                    />
                  </div>
                )}

                {isCity && (
                  <div style={clasess.fieldContainer}>
                    <div style={clasess.labelStyle}>
                      {t("sales.quote.city")}
                    </div>
                    {/* <GoMakeAutoComplate
                      options={["A", "B", "C", "D", "E", "F"]}
                      style={clasess.autoComplateStyle}
                      placeholder={t("sales.quote.city")}
                    /> */}
                    <GomakeTextInput
                      placeholder={t("sales.quote.city")}
                      style={clasess.textInputStyle}
                      value={item?.city}
                    />
                  </div>
                )}

                {isStreet && (
                  <div style={clasess.fieldContainer}>
                    <div style={clasess.labelStyle}>
                      {t("sales.quote.street")}
                    </div>
                    {/* <GoMakeAutoComplate
                      options={["A", "B", "C", "D", "E", "F"]}
                      style={clasess.autoComplateStyle}
                      placeholder={t("sales.quote.street")}
                    /> */}
                    <GomakeTextInput
                      placeholder={t("sales.quote.street")}
                      style={clasess.textInputStyle}
                      value={item?.street}
                    />
                  </div>
                )}

                {isEntrance && (
                  <div style={clasess.fieldContainer}>
                    <div style={clasess.labelStyle}>
                      {t("sales.quote.entrance")}
                    </div>
                    {/* <GoMakeAutoComplate
                      options={["A", "B", "C", "D", "E", "F"]}
                      style={clasess.autoComplateStyle}
                      placeholder={t("sales.quote.entrance")}
                    /> */}
                    <GomakeTextInput
                      placeholder={t("sales.quote.entrance")}
                      style={clasess.textInputStyle}
                      value={item?.entry}
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
                      value={item?.apartment}
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
                            <div
                              style={clasess.addContactContainer}
                              onClick={() => setIsAddNewContactWidget(true)}
                            >
                              <AddPlusIcon stroke={"#090A1D"} />
                              <div style={clasess.addContactStyle}>
                                Add new Address
                              </div>
                            </div>
                          )}
                        </div>
                      ) : null}
                      <div>
                        <div style={clasess.addContactContainer}>
                          <RemoveIcon />
                          <div style={clasess.removeContactStyle}>Remove</div>
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
        <div style={clasess.noAddressContaner}>
          {!isAddNewContactWidget && (
            <div
              style={clasess.addContactContainer}
              onClick={() => setIsAddNewContactWidget(true)}
            >
              <AddPlusIcon stroke={"#090A1D"} />
              <div style={clasess.addContactStyle}>Add new Address</div>
            </div>
          )}
        </div>
      )}

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
