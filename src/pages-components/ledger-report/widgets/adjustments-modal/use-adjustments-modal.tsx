import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { Checkbox } from "@mui/material";

import { useCustomerDropDownList, useGomakeAxios, useSnackBar } from "@/hooks";
import { CheckboxCheckedIcon, CheckboxIcon } from "@/icons";
import { EHttpMethod } from "@/services/api-service/enums";
import { GomakeTextInput } from "@/components";

export interface JustmentsModalProps {
  getClientPaymentItems: any;
  clientPaymentsList: any;
}

const useadJustmentsModal = ({ getClientPaymentItems, clientPaymentsList }: JustmentsModalProps) => {
  const { customer, renderOptions, checkWhatRenderArray, handleCustomerChange } = useCustomerDropDownList()
  const { alertFaultUpdate, alertFaultDelete, alertFault, alertSuccess } = useSnackBar();
  const { callApi } = useGomakeAxios();
  const { t } = useTranslation();

  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const [openTransferModal, setOpenTransferModal] = useState<boolean>(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [inputErrors, setInputErrors] = useState([]);
  const onClickOpenDeleteModal = () => {
    if (selectedItems?.length > 0) {
      setOpenDeleteModal(true);
    }
    else {
      alertFault("reports.pleaseSelectOneItem");
    }
  };
  const onClickCloseDeleteModal = () => {
    setOpenDeleteModal(false);
  };

  const onClickOpenTransferModal = () => {
    if (selectedItems?.length > 0) {
      setOpenTransferModal(true);
    }
    else {
      alertFault("reports.pleaseSelectOneItem");
    }
  };
  const onClickCloseTransferModal = () => {
    setOpenTransferModal(false);
  };
  const tableHeaders = [
    t("reports.price"),
    t("reports.fixedPrice"),
    t("reports.documentDate"),
    t("reports.details"),
    t("reports.documentNumber"),
    ""
  ];
  const internalReconciliationApi = useCallback(
    async () => {
      const res = await callApi(
        EHttpMethod.POST,
        `/v1/erp-service/receipts/internal-reconciliation`,
        {
          data: [...selectedItems]
        }
      );
      if (res?.success) {
        getClientPaymentItems()
      } else {
        alertFaultUpdate()
      }
    },
    [selectedItems]
  );

  // Function to toggle selection of an item
  const toggleSelection = (index) => {
    const newList = [...clientPaymentsList];
    newList[index].isSelected = !newList[index].isSelected;
    setSelectedItems(newList.filter(item => item.isSelected));
  };

  // Function to calculate the total price of selected items
  const calculateTotalPrice = () => {
    return selectedItems.reduce((total, item) => total + item.price, 0);
  };
  useEffect(() => {
    if (clientPaymentsList.length > 0) {
      setInputErrors(Array(clientPaymentsList.length).fill(false))
    }
  }, [clientPaymentsList])
  const handlePriceChange = (index, newValue) => {
    const newList = [...clientPaymentsList];
    const currentItem = newList[index];
    setSelectedItems(newList.filter(item => item.isSelected));

    // Check conditions based on the sign of the fixed price
    let error = false;
    if (currentItem.fixedPrice >= 0) {
      if (newValue < 0 || newValue > currentItem.fixedPrice) {
        error = true;
      }
    } else {
      if (newValue > 0 || newValue < currentItem.fixedPrice) {
        error = true;
      }
    }
    const newInputErrors = [...inputErrors];
    newInputErrors[index] = error;
    setInputErrors(newInputErrors);
    currentItem.price = newValue;
  };
  const getTableDataRows = useCallback(() => {
    return clientPaymentsList?.map((data, index) => [

      <div key={inputErrors[index]}>
        <GomakeTextInput
          key={inputErrors[index]}
          style={{ height: 40, marginLeft: 5 }}
          id={`priceInput-${index}`}
          type="number"
          InputProps={{ inputProps: { min: 0, max: 100 } }}
          value={data.price}
          onChange={(e) => handlePriceChange(index, parseFloat(e.target.value))}
          error={inputErrors[index]}
        />
      </div>,
      data?.fixedPrice,
      data?.docDate?.split("T")[0],
      data?.text,
      data?.docNum,
      <div>
        <Checkbox
          icon={<CheckboxIcon />}
          checkedIcon={<CheckboxCheckedIcon />}
          checked={data.isSelected}
          onChange={() => toggleSelection(index)}
        />
      </div>

    ]);
  }, [clientPaymentsList, inputErrors]);
  const btns = [
    {
      name: t("reports.transferBalance"),
      onclick: onClickOpenTransferModal
    },
    {
      name: t("reports.balanceCancellation"),
      onclick: onClickOpenDeleteModal
    },
    {
      name: t("reports.match"),
      onclick: internalReconciliationApi
    }
  ]
  const cancelTransactionsApi = useCallback(
    async () => {
      const res = await callApi(
        EHttpMethod.POST,
        `/v1/erp-service/receipts/cancel-transactions`,
        {
          data: [...selectedItems]
        }
      );
      if (res?.success) {
        getClientPaymentItems()
      } else {
        alertFaultDelete()
      }
    },
    [selectedItems]
  );
  const transferBalanceApi = useCallback(
    async () => {
      const res = await callApi(
        EHttpMethod.POST,
        `/v1/erp-service/receipts/move-transactions-to-client`,
        {
          clientId: customer.id,
          data: [...selectedItems]
        }
      );
      if (res?.success) {
        alertSuccess(`reports.successfullyMovedTransaction`)
        getClientPaymentItems()
      } else {
        alertFault("reports.failedMoveTransaction");
      }
    },
    [selectedItems, customer]
  );
  return {
    getTableDataRows,
    calculateTotalPrice,
    onClickCloseDeleteModal,
    cancelTransactionsApi,
    onClickCloseTransferModal,
    renderOptions,
    checkWhatRenderArray,
    handleCustomerChange,
    transferBalanceApi,
    t,
    tableHeaders,
    btns,
    openDeleteModal,
    openTransferModal,
    customer,
  };
};

export { useadJustmentsModal };
