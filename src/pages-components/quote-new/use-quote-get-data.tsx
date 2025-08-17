import { useGomakeAxios, useSnackBar } from "@/hooks";
import {
  getAndSetClientAddress,
  getAndSetClientContacts,
} from "@/services/hooks";
import {
  IContactData,
  addressSelectState,
  clientAddressState,
  clientContactsState,
  quoteConfirmationState,
  quoteItemState,
} from "@/store";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { currencyUnitState } from "@/store/currency-units";
import { DOCUMENT_TYPE } from "../quotes/enums";
import { useRouter } from "next/router";
import { EHttpMethod } from "@/services/api-service/enums";
import {
  addressModalState,
  EAddressType,
} from "@/widgets/quote-new/business-widget/address-widget/state";
import {
  addDocumentAddressApi,
  getDocumentApi,
  updateDocumentAddressApi,
} from "@/services/api-service/generic-doc/documents-api";
import { v4 as uuidv4 } from "uuid";
import {
  getClientPaymentItemsApi,
  getReceiptByIdApi,
} from "@/services/api-service/generic-doc/receipts-api";
import { getAllShipmentTypesApi } from "@/services/api-service/shipmentTypes/shipment-type-api";
import { EPreferences } from "@/enums/prefernces";
import { usePrintHousePreferences } from "@/hooks/use-print-house-preferences";
import { validateAddressApi } from "@/services/api-service/customers/customers-api";
import { validateUsAddressFields } from "@/utils/helpers";
import { useTranslation } from "react-i18next";
import { shouldReopenOrderModalState } from "@/store/order-modal-states";
import { useButtonsContainer } from "@/widgets/quote-new/buttons-container/use-buttons-container";
import {navStatusState, pageTitleState} from "@/store/nav-status";
import {useDocumentTitle} from "@/pages-components/quote-new/use-document-title";

const useQuoteGetData = (docType?: DOCUMENT_TYPE) => {
  const { callApi } = useGomakeAxios();
  const { t } = useTranslation();
  const router = useRouter();
  const {
    alertSuccessUpdate,
    alertSuccessAdded,
    alertFaultAdded,
    alertFaultGetData,
    alertRequiredFields,
    alertFault,
  } = useSnackBar();
  const { CheckPreferenceValue } = usePrintHousePreferences();
  const setPageTitle = useSetRecoilState(pageTitleState);
  const {documentTitle} = useDocumentTitle(docType, router?.query?.isOutgoingPayments === "true")
  const isUsAddress = !!CheckPreferenceValue(
    EPreferences.ADDRESSES_WITH_COUNTRY_AND_STATE
  );
  const [clientAddressValue, setClientAddressValue] =
    useRecoilState<any>(clientAddressState);
  const setClientContactsValue =
    useSetRecoilState<IContactData[]>(clientContactsState);
  const currenciesUnits = useRecoilValue<any>(currencyUnitState);
  const addressSelect = useRecoilValue(addressSelectState);
  const quoteConfirm = useRecoilValue<any>(quoteConfirmationState);
  const [shipmentTypes, setShipmentTypes] = useState<
    { label: string; value: string; price: any }[]
  >([]);
  const [quoteItemValue, setQuoteItemValue] =
    useRecoilState<any>(quoteItemState);
  const setOpenModal = useSetRecoilState<boolean>(addressModalState);
  const [requestAbortController, setRequestAbortController] =
    useState<AbortController>(null);
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

  const getAllShipmentTypes = async (includeSelfPickup = false) => {
    const callBack = (res) => {
      if (res?.success) {
        let types = res?.data.map((item) => ({
          value: item.id,
          label: item.title,
          price: item?.initialPrice,
        }));

        // Add "Self Pickup" only if the prop is true
        if (includeSelfPickup) {
          types.push({
            value: "self_pickup",
            label: "Self Pickup",
            price: 0, // Assuming there's no price for self-pickup
          });
        }

        setShipmentTypes(types);
      }
    };

    await getAllShipmentTypesApi(callApi, callBack);
  };

  const getCurrencyUnitText = (currency) => {
    const foundCurrency = currenciesUnits?.find((c) => c.value === currency);
    if (foundCurrency) {
      return foundCurrency.text;
    } else {
      return "";
    }
  };

  const { onClickOpenOrderNowModal } = useButtonsContainer(DOCUMENT_TYPE.quote);
  const [shouldReopen, setShouldReopen] = useRecoilState(
    shouldReopenOrderModalState
  );

  const getQuote = useCallback(async () => {
    if (requestAbortController) {
      requestAbortController.abort();
    }

    try {
      if (
        router?.query?.isNewCreation &&
        docType === DOCUMENT_TYPE.receipt &&
        router?.query?.documentNumber &&
        router?.query?.ClientId
      ) {
        return; // No need to call anything if opening receipt page from pay option
      }

      if (router?.query?.isNewCreation && docType === DOCUMENT_TYPE.receipt) {
        const callBack = (res) => {
          if (res?.success) {
            const _data = res?.data || {};
            setQuoteItemValue(_data);
          } else {
            alertFaultGetData();
          }
        };
        await getClientPaymentItemsApi(callApi, callBack);
      } else if (router?.query?.isNewCreation) {
        const requestBody = {
          documentType: docType,
          ...(router?.query.orderId && { orderId: router.query.orderId }),
          ...(router?.query.deliveryNoteId && {
            deliveryNoteID: router.query.deliveryNoteId,
          }),
          ...(router?.query.documentToDuplicateId && {
            documentToDuplicateId: router.query.documentToDuplicateId,
          }),
          ...(router?.query.documentId && {
            documentId: router.query.documentId,
          }),
          ...(router?.query.budgetId && { budgetId: router.query.budgetId }),

          ...(router?.query.draftInvoiceId && {
            documentId: router.query.draftInvoiceId,
          }),
          ...(router?.query.draftPurchaseInvoiceId && {
            documentId: router.query.draftPurchaseInvoiceId,
          }),
        };

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
      } else if (docType === DOCUMENT_TYPE.receipt) {
        const isOutgoingPayments = router?.query?.isOutgoingPayments === "true";
        const supplierPaymentId = router?.query?.id;

        const callBack = (res) => {
          if (res?.success) {
            const _data = res?.data || {};
            setPageTitle(documentTitle + " " +_data.number)
            setQuoteItemValue(_data);
          } else {
            alertFaultGetData();
          }
        };
        await getReceiptByIdApi(callApi, callBack, {
          receiptId: router?.query?.Id || router?.query?.id,
        });
      } else {
        const newRequestAbortController = new AbortController();
        setRequestAbortController(newRequestAbortController);

        const callBack = (res) => {
          if (res?.success) {
            
            let indexs = 0;
            const _data = res?.data || {};
            setPageTitle(documentTitle + " " +_data.number)
            const mapData = _data?.documentItems?.map((item, index) => {
              indexs++;
              const parentIndex = indexs;
              const _childsDocumentItemsMapping =
                item?.childsDocumentItems?.map((child, index2) => {
                  indexs++;
                  return {
                    id: indexs,
                    amount: child?.quantity,
                    unitPrice: child?.price,
                    discount: child?.discount,
                    finalPrice: child?.finalPrice,
                    quoteItemId: child?.id,
                  };
                });
              return {
                id: parentIndex,
                itemName: item?.productName,
                details: (
                  <div
                    style={
                      _childsDocumentItemsMapping
                        ? {
                            height: "100%",
                            overflowY: "scroll",
                            paddingRight: 5,
                          }
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
            if (shouldReopen) {
              onClickOpenOrderNowModal(true);
              setShouldReopen(false);
            }
          } else {
            alertFaultGetData();
          }
        };

        await getDocumentApi(
          callApi,
          callBack,
          {
            documentType: docType,
            Id: router?.query?.Id || router?.query?.id,
          },
          false,
          newRequestAbortController
        );
      }
    } catch (error) {
      if (error.name === "AbortError") {
        return;
      } else {
        alertFaultGetData();
      }
    }
  }, [
    callApi,
    docType,
    requestAbortController,
    router,
    setQuoteItemValue,
    // executeIfNeeded,
    shouldReopen,
    setShouldReopen,
  ]);

  const validateAddress = async (addressWithMetadata) => {
    return await validateAddressApi(callApi, () => {}, addressWithMetadata);
  };

  const onClickAddAddress = async (item: any, addressType: EAddressType) => {
    if (!item?.city) {
      alertRequiredFields();
      return;
    }

    const addressWithMetadata = {
      ...item,
      type: addressType,
      notes: item?.notes || "",
      documentID: quoteItemValue?.id,
    };

    if (router.query.isNewCreation) {
      const updatedQuoteItemValue = { ...quoteItemValue };
      const addressArray =
        addressType === EAddressType.BILLING
          ? "documentBillingAddresses"
          : "documentDeliveryAddresses";

      if (!Array.isArray(updatedQuoteItemValue[addressArray])) {
        updatedQuoteItemValue[addressArray] = [];
      }

      const newAddress = {
        id: uuidv4(),
        ...addressWithMetadata,
      };

      updatedQuoteItemValue[addressArray] = [
        ...updatedQuoteItemValue[addressArray],
        newAddress,
      ];

      setQuoteItemValue(updatedQuoteItemValue);
      setOpenModal(false);
    } else {
      const callBack = (res) => {
        if (res.success) {
          alertSuccessAdded();
          getQuote();
          setOpenModal(false);
        } else {
          alertFaultAdded();
        }
      };

      await addDocumentAddressApi(callApi, callBack, {
        documentType: docType,
        address: addressWithMetadata,
      });
    }
  };

  const onClickAddNewAddress = useCallback(
    async (item: any, isUpdate: boolean, addressType: EAddressType) => {
      if (!item?.city && !isUsAddress) {
        alertFault(`${t("modal.RequiredFields")}: ${t("sales.quote.city")}`);
        return;
      }

      const addressWithMetadata = Object.fromEntries(
        Object.entries({
          ...item,
          type: addressType,
          clientId: quoteItemValue?.customerID,
        }).filter(
          ([_, value]) => value !== undefined && value !== null && value !== ""
        )
      );

      // Validate required fields (for US addresses)
      if (isUsAddress) {
        const { isValid, missingFields } =
          validateUsAddressFields(addressWithMetadata);
        if (!isValid) {
          const translatedFields = missingFields
            .map((fieldKey) => t(fieldKey))
            .join(", ");

          alertFault(`${t("modal.RequiredFields")}: ${translatedFields}`);
          return;
        }

        const validateRes = await validateAddress(addressWithMetadata);
        if (!validateRes?.success || validateRes?.data?.ErrorMessage) {
          alertFault(
            validateRes?.data?.ErrorMessage || "Address validation failed."
          );
          return;
        }
      }

      const res = await callApi(
        EHttpMethod.POST,
        `/v1/crm-service/customer/create-address`,
        addressWithMetadata
      );

      if (res?.success) {
        alertSuccessAdded();
        const result = await getAllClientAddress();
        const addedAddress = result.find(
          (item) => item.id === res.data.data.result
        );

        if (isUpdate) {
          updateClientAddress(addedAddress, addressType);
        } else {
          onClickAddAddress(addedAddress, addressType);
        }
      } else {
        alertFaultAdded();
      }
    },
    [quoteItemValue, router]
  );

  const updateClientAddress = async (item: any, addressType: EAddressType) => {
    if (!item?.city && !isUsAddress) {
      alertFault(`${t("modal.RequiredFields")}: ${t("sales.quote.city")}`);
      return;
    }

    const addressArray =
      addressType === EAddressType.BILLING
        ? "documentBillingAddresses"
        : "documentDeliveryAddresses";

    const addressWithMetadata = Object.fromEntries(
      Object.entries({
        ...item,
        id: quoteItemValue?.[addressArray]?.[0]?.id,
        addressID: quoteItemValue?.[addressArray]?.[0]?.addressID,
        type: addressType,
        documentID: quoteItemValue?.id,
      }).filter(
        ([_, value]) => value !== undefined && value !== null && value !== ""
      )
    );

    // Validate required fields (for US addresses)
    if (isUsAddress) {
      const { isValid, missingFields } =
        validateUsAddressFields(addressWithMetadata);
      if (!isValid) {
        const translatedFields = missingFields
          .map((fieldKey) => t(fieldKey))
          .join(", ");
        alertFault(`${t("modal.RequiredFields")}: ${translatedFields}`);
        return;
      }

      const validateRes = await validateAddress(addressWithMetadata);

      if (!validateRes?.success || validateRes?.data?.ErrorMessage) {
        alertFault(
          validateRes?.data?.ErrorMessage || t("errors.addressValidationFailed")
        );
        return;
      }
    }
    if (router.query.isNewCreation) {
      const updatedQuoteItemValue = { ...quoteItemValue };
      const updatedAddresses = updatedQuoteItemValue[addressArray].map(
        (address) => {
          if (address.id === item.id) {
            const cleanedItem = Object.fromEntries(
              Object.entries({
                ...address,
                ...item,
                notes: item.notes || "",
              }).filter(
                ([_, value]) =>
                  value !== null && value !== undefined && value !== ""
              )
            );
            return cleanedItem;
          }
          return address;
        }
      );

      updatedQuoteItemValue[addressArray] = updatedAddresses;
      setQuoteItemValue(updatedQuoteItemValue);
      setOpenModal(false);
    } else {
      const callBack = (res) => {
        if (res?.success) {
          alertSuccessUpdate();
          getQuote();
          setOpenModal(false);
        } else {
          alertFaultAdded();
        }
      };

      const addressArray =
        addressType === EAddressType.BILLING
          ? "documentBillingAddresses"
          : "documentDeliveryAddresses";

      const addressWithMetadata = Object.fromEntries(
        Object.entries({
          ...item,
          id: quoteItemValue?.[addressArray]?.[0]?.id,
          addressID: quoteItemValue?.[addressArray]?.[0]?.addressID,
          type: addressType,
          documentID: quoteItemValue?.id,
        }).filter(
          ([_, value]) => value !== undefined && value !== null && value !== ""
        )
      );

      await updateDocumentAddressApi(callApi, callBack, {
        documentType: docType,
        address: addressWithMetadata,
      });
    }
  };

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
    updateClientAddress,
    onClickAddAddress,
    onClickAddNewAddress,
  };
};

export { useQuoteGetData };
