import { useTranslation } from "react-i18next";
import { useRecoilState, useRecoilValue } from "recoil";

import { clientAddressState, quoteItemState } from "@/store";
import { AddPlusIcon, RemoveIcon } from "@/icons";
import {
  GoMakeAutoComplate,
  GoMakeDeleteModal,
  GomakeTextInput,
} from "@/components";

import { AddAddressWidget } from "./add-address-widget";
import { quoteState } from "../../store/quote";
import { useStyle } from "./style";

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
  const quoteStateValue = useRecoilValue<any>(quoteState);
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
                          {!quoteStateValue.isAddNewAddressWidget && (
                            <div
                              style={clasess.addContactContainer}
                              onClick={() =>
                                quoteStateValue.setIsAddNewAddressWidget(true)
                              }
                            >
                              <AddPlusIcon stroke={"#090A1D"} />
                              <div style={clasess.addContactStyle}>
                                {t("sales.quote.addNewAddress")}
                              </div>
                            </div>
                          )}
                        </div>
                      ) : null}
                      <div
                        style={clasess.addContactContainer}
                        onClick={() =>
                          quoteStateValue?.onOpenDeleteModalAddress(item)
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
        <div style={clasess.noAddressContaner}>
          {!quoteStateValue.isAddNewAddressWidget && (
            <div
              style={clasess.addContactContainer}
              onClick={() => quoteStateValue.setIsAddNewAddressWidget(true)}
            >
              <AddPlusIcon stroke={"#090A1D"} />
              <div style={clasess.addContactStyle}>
                {t("sales.quote.addNewAddress")}
              </div>
            </div>
          )}
        </div>
      )}

      {quoteStateValue.isAddNewAddressWidget && <AddAddressWidget />}
      <GoMakeDeleteModal
        title={t("sales.quote.deleteAddressRow")}
        yesBtn={t("materials.buttons.delete")}
        openModal={quoteStateValue?.openDeleteModalAddress}
        onClose={quoteStateValue?.onCloseDeleteModalAddress}
        subTitle={t("sales.quote.subTitleDeleteAddressRow")}
        onClickDelete={() =>
          quoteStateValue?.onClickDeleteAddress(
            quoteStateValue?.selectedAddress
          )
        }
      />
    </>
  );
};

export { AddressWidget };
