import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { addressModalState, isNewAddress } from "./state";
import { useQuoteNew } from "@/pages-components/quote-new/use-quote";
import { quoteItemState } from "@/store";
import { useQuoteGetData } from "@/pages-components/quote-new/use-quote-get-data";

const useAddressWidget = () => {
    const { t } = useTranslation();
    const { updateClientAddress, onClickAddAddress, onClickAddNewAddress } = useQuoteNew();
    const { getAllClientAddress, clientAddressValue, addressSelect } = useQuoteGetData();
    const quoteStateValue = useRecoilValue<any>(quoteItemState);
    const [openModal, setOpenModal] = useRecoilState<boolean>(addressModalState);
    const [addressState, setAddressState] = useState<any>(quoteStateValue?.quoteAddresses[0]);
    const [selectedAddress, setSelectedAddress] = useState<any>(null);
    const [isNewAddressState, setIsNewAddressState] = useRecoilState<boolean>(isNewAddress);
    const [flag, setFlag] = useState<boolean>(false);

    const onChangeInputs = (key, value) => {
        setAddressState({ ...addressState, [key]: value });
    }

    useEffect(() => {
        getAllClientAddress();
        if (quoteStateValue?.quoteAddresses.length > 0) {
            const addressId = quoteStateValue?.quoteAddresses[0]?.addressID;
            const city = quoteStateValue?.quoteAddresses[0]?.city;
            setFlag(true);
            setSelectedAddress({ label: city, value: addressId });
        }
        else {
            setSelectedAddress(addressSelect[0])
        }
    }, [quoteStateValue, openModal]);

    useEffect(() => {
        if (selectedAddress?.label == "add new address") {
            setAddressState({ city: "", street: "", addressId: "", apartment: "", entry: "" })
            setIsNewAddressState(true);
        }
        else if (selectedAddress) {
            setIsNewAddressState(false);
            const address = clientAddressValue.find(x => x.id === selectedAddress.value);
            flag ? setAddressState(quoteStateValue?.quoteAddresses[0]) : setAddressState(address)
            setFlag(false)
        }
    }, [selectedAddress]);

    return {
        t,
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
        setSelectedAddress
    };
};

export { useAddressWidget };