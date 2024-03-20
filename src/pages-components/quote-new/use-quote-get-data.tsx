import { useGomakeAxios, useSnackBar } from "@/hooks";
import { getAndSetClientAddress, getAndSetClientContacts } from "@/services/hooks";
import { IContactData, addressSelectState, clientAddressState, clientContactsState, quoteConfirmationState, quoteItemState } from "@/store";
import { useCallback, useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { currencyUnitState } from "@/store/currency-units";
import { getAllShipmentTypesApi } from "@/services/api-service/shipmentTypes/get-shipment-types-api";
import { DOCUMENT_TYPE } from "../quotes/enums";
import { useRouter } from "next/router";
import { EHttpMethod } from "@/services/api-service/enums";
import { addressModalState } from "@/widgets/quote-new/business-widget/address-widget/state";
import { addDocumentAddressApi, getDocumentApi, updateDocumentAddressApi } from "@/services/api-service/generic-doc/documents-api";
import { v4 as uuidv4 } from "uuid";
import { getClientPaymentItemsApi, getReceiptByIdApi } from "@/services/api-service/generic-doc/receipts-api";

const useQuoteGetData = (docType?: DOCUMENT_TYPE) => {
  const { callApi } = useGomakeAxios();
  const router = useRouter();
  const {
    alertSuccessUpdate,
    alertSuccessAdded,
    alertFaultAdded,
    alertFaultGetData
  } = useSnackBar();
  const [clientAddressValue, setClientAddressValue] = useRecoilState<any>(clientAddressState);
  const setClientContactsValue = useSetRecoilState<IContactData[]>(clientContactsState);
  const currenciesUnits = useRecoilValue<any>(currencyUnitState);
  const addressSelect = useRecoilValue(addressSelectState);
  const quoteConfirm = useRecoilValue<any>(quoteConfirmationState);
  const [shipmentTypes, setShipmentTypes] = useState<{ label: string, value: string }[]>([]);
  const [quoteItemValue, setQuoteItemValue] = useRecoilState<any>(quoteItemState);
  const setOpenModal = useSetRecoilState<boolean>(addressModalState);

  const getAllClientContacts = useCallback(async () => {
    if (quoteItemValue?.customerID) {
      await getAndSetClientContacts(callApi, setClientContactsValue, {
        ClientId: quoteItemValue?.customerID,
      });
    }
  }, [quoteItemValue?.customerID, quoteConfirm]);

  const getAllClientAddress = useCallback(async () => {
    if (quoteItemValue?.customerID) {
      return await getAndSetClientAddress(callApi, setClientAddressValue, {
        ClientId: quoteItemValue?.customerID,
      });
    }
  }, [quoteItemValue?.customerID]);

  const getAllShipmentTypes = async () => {
    const callBack = (res) => {
      if (res?.success) {
        const types = res?.data.map((item) => ({ value: item.id, label: item.title }))
        setShipmentTypes(types)
      }
    }
    await getAllShipmentTypesApi(callApi, callBack)
  }

  const getCurrencyUnitText = (currency) => {
    const foundCurrency = currenciesUnits.find(c => c.value === currency);
    if (foundCurrency) {
      return foundCurrency.text;
    } else {
      return "";
    }
  };

  // in case of an error all these routes have been moved from use-quote.tsx to current hook (use-quote-get-data.tsx) 
  const getQuote = async () => {
    if (router?.query?.isNewCreation && docType === DOCUMENT_TYPE.receipt) {
      const callBack = (res) => {
        if (res?.success) {
          const _data = res?.data || {};
          setQuoteItemValue(_data);
        } else {
          alertFaultGetData();
        }
      }
      await getClientPaymentItemsApi(callApi, callBack)
    }
    else if (router?.query?.isNewCreation) {
      const requestBody: any = {
        documentType: docType
      };
      if (router?.query.orderId) {
        requestBody.orderId = router.query.orderId;
      }
      if (router?.query.deliveryNoteId) {
        requestBody.deliveryNoteID = router.query.deliveryNoteId;
      }
      if (router?.query.documentToDuplicateId) {
        requestBody.documentToDuplicateId = router.query.documentToDuplicateId;
      }
      if (router?.query.documentId) {
        requestBody.documentId = router.query.documentId;
      }
      const res = await callApi(
        EHttpMethod.POST,
        `/v1/erp-service/documents/get-new-document-data`,
        requestBody
      );

      if (res?.success) {
        const _data = res?.data?.data?.result || {};
        setQuoteItemValue(_data);
      } else {
        alertFaultGetData();
      }
    }
    else if (docType === DOCUMENT_TYPE.receipt) {
      const callBack = (res) => {
        if (res?.success) {
          const _data = res?.data || {};
          setQuoteItemValue(_data);
        } else {
          alertFaultGetData();
        }
      }
      await getReceiptByIdApi(callApi, callBack, { receiptId: router?.query?.Id })
    }
    else {
      const callBack = (res) => {
        if (res?.success) {
          let indexs = 0;
          const _data = res?.data || {};
          const mapData = _data?.documentItems?.map((item: any, index: number) => {
            indexs++;
            const parentIndex = indexs;
            const _childsDocumentItemsMapping = item?.childsDocumentItems?.map(
              (child: any, index2: number) => {
                indexs++;
                return {
                  id: indexs,
                  amount: child?.quantity,
                  unitPrice: child?.price,
                  discount: child?.discount,
                  finalPrice: child?.finalPrice,
                  quoteItemId: child?.id,
                };
              }
            );
            return {
              id: parentIndex,
              itemName: item?.productName,
              details: (
                <div
                  style={
                    _childsDocumentItemsMapping != null
                      ? { height: "100%", overflowY: "scroll", paddingRight: 5 }
                      : { height: 36, overflowY: "scroll", paddingRight: 5 }
                  }
                >
                  {item?.content}
                </div>
              ),
              amount: item?.quantity,
              unitPrice: item?.price,
              discount: item?.discount,
              finalPrice: item?.finalPrice,
              quoteItemId: item?.id,
              childsDocumentItems: _childsDocumentItemsMapping,
            };
          });
          _data.documentItemsMapping = mapData;
          setQuoteItemValue(_data);
        } else {
          alertFaultGetData();
        }
      }
      await getDocumentApi(callApi, callBack, { documentType: docType, Id: router?.query?.Id })
    }
  }

  const onClickAddNewAddress = useCallback(async (item: any, isUpdate: boolean) => {
    const res = await callApi(
      EHttpMethod.POST,
      `/v1/crm-service/customer/create-address`,
      {
        address1: item?.addressId,
        street: item?.street,
        city: item?.city,
        entry: item?.entry,
        apartment: item?.apartment,
        clientId: quoteItemValue?.customerID,
      }
    );
    if (res?.success) {
      alertSuccessAdded();
      const result = await getAllClientAddress();
      isUpdate ? updateClientAddress(result.find(item => item.id === res.data.data.result)) :
        onClickAddAddress(result.find(item => item.id === res.data.data.result))
    } else {
      alertFaultAdded();
    }

  }, [quoteItemValue, router]);

  const updateClientAddress = async (item: any) => {
    if (router.query.isNewCreation) {
      const updatedQuoteItemValue = { ...quoteItemValue };
      const updatedAddresses = updatedQuoteItemValue.documentAddresses.map((address) => {
        if (address.id === item.id) {
          return {
            ...address,
            street: item.street,
            city: item.city,
            entry: item.entry,
            apartment: item.apartment,
            notes: item.notes || "",
          };
        }
        return address;
      });
      updatedQuoteItemValue.documentAddresses = updatedAddresses;
      setQuoteItemValue(updatedQuoteItemValue);
      setOpenModal(false);
    }
    else {
      const callBack = (res) => {
        if (res?.success) {
          alertSuccessUpdate();
          getQuote();
          setOpenModal(false);
        } else {
          alertFaultAdded();
        }
      }
      await updateDocumentAddressApi(callApi, callBack, {
        documentType: docType,
        address: {
          id: quoteItemValue?.documentAddresses[0]?.id,
          addressID: quoteItemValue?.documentAddresses[0]?.addressID,
          street: item?.street,
          city: item?.city,
          entry: item?.entry,
          apartment: item?.apartment,
          notes: item?.notes || "",
          documentID: quoteItemValue?.id,
        }
      })
    }
  }

  const onClickAddAddress = async (item: any) => {
    if (router.query.isNewCreation) {
      const updatedQuoteItemValue = { ...quoteItemValue };
      if (!Array.isArray(updatedQuoteItemValue.documentAddresses)) {
        updatedQuoteItemValue.documentAddresses = [];
      }
      const newAddress = {
        id: uuidv4(),
        addressID: item?.addressId,
        street: item?.street,
        city: item?.city,
        entry: item?.entry,
        apartment: item?.apartment,
        notes: "",
        documentID: updatedQuoteItemValue?.id,
      };
      updatedQuoteItemValue.documentAddresses = [...updatedQuoteItemValue.documentAddresses, newAddress];
      setQuoteItemValue(updatedQuoteItemValue);
      setOpenModal(false);
    }
    else {
      const callBack = (res) => {
        if (res.success) {
          alertSuccessAdded();
          getQuote();
          setOpenModal(false);
        }
        else {
          alertFaultAdded();
        }
      }
      await addDocumentAddressApi(callApi, callBack, {
        documentType: docType,
        address: {
          addressID: item?.id,
          street: item?.street,
          city: item?.city,
          entry: item?.entry,
          apartment: item?.apartment,
          notes: item?.notes || "",
          documentID: quoteItemValue?.id,

        }
      })
    }
  }

  return {
    getQuote,
    quoteItemValue,
    clientAddressValue,
    addressSelect,
    getAllClientAddress,
    getAllClientContacts,
    getCurrencyUnitText,
    getAllShipmentTypes,
    shipmentTypes,
    updateClientAddress, onClickAddAddress, onClickAddNewAddress
  };
};

export { useQuoteGetData };