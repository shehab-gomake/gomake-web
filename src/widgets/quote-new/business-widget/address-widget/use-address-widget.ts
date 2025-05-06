import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { addressModalState, EAddressType, isNewAddress } from "./state";
import { quoteItemState } from "@/store";
import { useQuoteGetData } from "@/pages-components/quote-new/use-quote-get-data";
import { DOCUMENT_TYPE } from "@/pages-components/quotes/enums";
import { usePrintHousePreferences } from "@/hooks/use-print-house-preferences";
import { EPreferences } from "@/enums/prefernces";

interface useAddressWidgetProps {
  docType: DOCUMENT_TYPE;
  addressType: EAddressType;
}
const useAddressWidget = ({ docType, addressType }: useAddressWidgetProps) => {
  const { t } = useTranslation();
  const {
    updateClientAddress,
    onClickAddAddress,
    onClickAddNewAddress,
    getAllClientAddress,
    clientAddressValue,
    addressSelect,
  } = useQuoteGetData(docType);
  const { CheckPreferenceValue } = usePrintHousePreferences();
  const isUsAddress = !!CheckPreferenceValue(
    EPreferences.ADDRESSES_WITH_COUNTRY_AND_STATE
  );
  const quoteStateValue = useRecoilValue<any>(quoteItemState);
  const [openModal, setOpenModal] = useRecoilState<boolean>(addressModalState);

  const getAddressData = () => {
    if (addressType === EAddressType.BILLING) {
      return quoteStateValue?.documentBillingAddresses?.[0];
    } else if (addressType === EAddressType.DELIVERY) {
      return quoteStateValue?.documentDeliveryAddresses?.[0];
    }
    return null;
  };

  const [addressState, setAddressState] = useState<any>(getAddressData());
  const [selectedAddress, setSelectedAddress] = useState<any>(null);
  const [isNewAddressState, setIsNewAddressState] =
    useRecoilState<boolean>(isNewAddress);
  const [flag, setFlag] = useState<boolean>(false);

  const onChangeInputs = (key, value) => {
    if (key === "country" && value !== "US") {
      setAddressState({
        ...addressState,
        [key]: value,
        state: "",
      });
    } else {
      setAddressState({ ...addressState, [key]: value });
    }
  };

  useEffect(() => {
    if (openModal) {
      getAllClientAddress();
      const addresses =
        addressType === EAddressType.BILLING
          ? quoteStateValue?.documentBillingAddresses
          : quoteStateValue?.documentDeliveryAddresses;

      if (addresses?.length > 0) {
        const addressId = addresses[0]?.id;
        const city = addresses[0]?.city;
        setFlag(true);
        setSelectedAddress({ label: city, value: addressId });
      } else {
        setSelectedAddress(addressSelect[0]);
      }
    }
  }, [quoteStateValue?.customerID, openModal]);

  useEffect(() => {
    if (selectedAddress?.label === "add new address") {
      setAddressState({
        city: "",
        street: "",
        apartment: "",
        entry: "",
        floor: "",
        postbox: "",
        zipCode: "",
        country: null,
        state: null,
        address2: "",
        address3: "",
        type: addressType,
      });
      setIsNewAddressState(true);
    } else if (selectedAddress) {
      setIsNewAddressState(false);
      const address = clientAddressValue.find(
        (x) => x.id === selectedAddress.value
      );
      flag ? setAddressState(getAddressData()) : setAddressState(address);
      setFlag(false);
    }
  }, [selectedAddress]);

  return {
    t,
    isUsAddress,
    onChangeInputs,
    addressState,
    openModal,
    setOpenModal,
    addressSelect,
    setAddressState,
    selectedAddress,
    isNewAddressState,
    onClickAddAddress,
    onClickAddNewAddress,
    updateClientAddress,
    setSelectedAddress,
    getAddressData,
  };
};

export { useAddressWidget };
