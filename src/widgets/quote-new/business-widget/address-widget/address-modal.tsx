import { FormInput } from "@/components/form-inputs/form-input";
import { IInput } from "@/components/form-inputs/interfaces";
import { GoMakeAutoComplate, GoMakeModal } from "@/components";
import { Stack } from "@mui/material";
import { addressInputs } from "./address-inputs";
import { useStyle } from "./style";
import { useAddressWidget } from "./use-address-widget";
import { DOCUMENT_TYPE } from "@/pages-components/quotes/enums";
import { EAddressType } from "./state";
import { PrimaryButton } from "@/components/button/primary-button";

interface IProps {
  isUpdate?: boolean;
  documentType: DOCUMENT_TYPE;
  addressType: EAddressType;
}

const AddressModal = ({ isUpdate, documentType, addressType }: IProps) => {
  const { classes } = useStyle();
  const {
    t,
    onChangeInputs,
    addressState,
    openModal,
    setOpenModal,
    addressSelect,
    selectedAddress,
    isNewAddressState,
    onClickAddAddress,
    onClickAddNewAddress,
    updateClientAddress,
    setSelectedAddress,
    isUsAddress,
    getAddressData,
    setAddressState,
    setShouldReopen,
  } = useAddressWidget({ docType: documentType, addressType });

  const buttonLabel = isUpdate ? t("sales.quote.save") : t("sales.quote.add");
  const isDeliveryAddress = addressType === EAddressType.DELIVERY;

  const handleClick = () => {
    if (isNewAddressState) {
      onClickAddNewAddress(addressState, isUpdate, addressType);
    } else if (isUpdate) {
      updateClientAddress(addressState, addressType);
    } else {
      onClickAddAddress(addressState, addressType);
    }
  };

  return (
    <GoMakeModal
      key={`${addressType}-address-modal`}
      insideStyle={classes.insideStyle}
      modalTitleStyle={classes.modalTitleStyle}
      openModal={openModal}
      onClose={() => {
        setAddressState(getAddressData());
        setOpenModal(false);
        setShouldReopen(false);
      }}
      modalTitle={
        isDeliveryAddress
          ? t("sales.cart.deliveryAddress")
          : t("sales.cart.billingAddress")
      }
      withRoundedCloseIcon={false}
    >
      <Stack style={classes.stackStyle} className="custom-scrollbar">
        <div style={classes.fieldContainer}>
          <h3 style={classes.labelStyle}>{t("sales.quote.address")}</h3>
          <GoMakeAutoComplate
            key={selectedAddress?.value || "New-ADDRESS"}
            disableClearable={true}
            options={addressSelect.filter(
              (address) => address.type === addressType || address.type === null
            )}
            value={selectedAddress}
            style={classes.autoComplateStyle}
            placeholder={t("sales.quote.address")}
            onChange={(e: any, value: any) => {
              setSelectedAddress(value);
            }}
          />
        </div>
        {addressInputs(addressState, isUsAddress).map((item, index) => (
          <Stack
            key={`address-input-${index}-${selectedAddress?.value}`}
            width={"330px"}
          >
            <FormInput
              key={item?.name}
              input={item as IInput}
              changeState={onChangeInputs}
              error={false}
              readonly={false}
            />
          </Stack>
        ))}
      </Stack>
      <PrimaryButton
        variant="contained"
        onClick={handleClick}
        style={classes.saveBtn}
      >
        {buttonLabel}
      </PrimaryButton>
    </GoMakeModal>
  );
};

export { AddressModal };
