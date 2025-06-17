import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Checkbox } from "@mui/material";
import { useCustomerDropDownList, useGomakeAxios, useSnackBar } from "@/hooks";
import { CheckboxCheckedIcon, CheckboxIcon } from "@/icons";
import { EHttpMethod } from "@/services/api-service/enums";
import { GomakeTextInput } from "@/components";
import { ERPDocumentsTypesEnum } from "@/enums";
import { adaptPaddingRight } from "@/utils/adapter";
import { GoMakeTextInput } from "@/components/text-input/go-make-text-input";

export interface JustmentsModalProps {
  getClientPaymentItems: any;
  clientPaymentsList: any;
  customerId: string;
}

const useAdjustmentsModal = ({
  getClientPaymentItems,
  clientPaymentsList,
  customerId,
}: JustmentsModalProps) => {
  const { t } = useTranslation();
  const direction = t("direction");
  const {
    customer,
    renderOptions,
    checkWhatRenderArray,
    handleCustomerChange,
    isFetching,
  } = useCustomerDropDownList({});
  const { alertFaultUpdate, alertFaultDelete, alertFault, alertSuccess } =
    useSnackBar();
  const { callApi } = useGomakeAxios();
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const [openTransferModal, setOpenTransferModal] = useState<boolean>(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [inputErrors, setInputErrors] = useState([]);
  const hasInputErrors = () => inputErrors.some((error) => error);

  const onClickOpenDeleteModal = () => {
    if (hasInputErrors()) {
      alertFault("reports.inputErrorAlert");
      return;
    }

    if (selectedItems?.length > 0) {
      setOpenDeleteModal(true);
    } else {
      alertFault("reports.pleaseSelectOneItem");
    }
  };

  const onClickCloseDeleteModal = () => {
    setOpenDeleteModal(false);
  };

  const onClickOpenTransferModal = () => {
    if (hasInputErrors()) {
      alertFault("reports.inputErrorAlert");
      return;
    }
    if (selectedItems?.length > 0) {
      setOpenTransferModal(true);
    } else {
      alertFault("reports.pleaseSelectOneItem");
    }
  };

  const onClickCloseTransferModal = () => {
    setOpenTransferModal(false);
  };

  const tableHeaders = [
    "#",
    t("reports.documentNumber"),
    t("reports.documentType"),
    t("reports.documentDate"),
    t("reports.dueDate"),
    t("reports.totalPrice"),
    t("reports.adjustablePrice"),
  ];

  const internalReconciliationApi = useCallback(async () => {
    const res = await callApi(
      EHttpMethod.POST,
      `/v1/erp-service/receipts/internal-reconciliation`,
      {
        data: [...selectedItems],
      }
    );
    if (res?.success) {
      getClientPaymentItems();
    } else {
      alertFaultUpdate();
    }
  }, [selectedItems]);

  // Function to toggle selection of an item
  const toggleSelection = (index) => {
    const newList = [...clientPaymentsList];
    newList[index].isSelected = !newList[index].isSelected;
    setSelectedItems(newList.filter((item) => item.isSelected));
  };

  // Function to calculate the total price of selected items
  const calculateTotalPrice = () => {
    const totalFinal = selectedItems.reduce(
      (total, item) => total + (Number(item.price) || 0),

      0
    );
    return Number(totalFinal) || 0;
  };

  useEffect(() => {
    if (clientPaymentsList.length > 0) {
      setInputErrors(Array(clientPaymentsList.length).fill(false));
    }
  }, [clientPaymentsList]);

  const handlePriceChange = (index, value) => {
    const newList = [...clientPaymentsList];
    const currentItem = newList[index];

    // Allow "-" or empty input without processing
    if (value === "" || value === "-") {
      currentItem.price = value;

      setInputErrors([...inputErrors]);
      return;
    }

    const newValue = parseFloat(value);
    let error = false;

    if (!isNaN(newValue)) {
      if (currentItem.fixedPrice >= 0) {
        error = newValue < 0 || newValue > currentItem.fixedPrice;
      } else {
        error = newValue > 0 || newValue < currentItem.fixedPrice;
      }
    }

    const newInputErrors = [...inputErrors];
    newInputErrors[index] = error;
    setInputErrors(newInputErrors);
    currentItem.price = newValue;
  };

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const getTableDataRows = useCallback(() => {
    return clientPaymentsList?.map((data, index) => [
      <div>
        <Checkbox
          icon={<CheckboxIcon />}
          checkedIcon={<CheckboxCheckedIcon />}
          checked={data.isSelected}
          onChange={() => toggleSelection(index)}
        />
      </div>,
      data?.docNum,
      t(
        `documentType.${capitalizeFirstLetter(
          ERPDocumentsTypesEnum[data?.type]
        )}`
      ),
      data?.docDate?.split("T")[0],
      data?.dueDate?.split("T")[0],
      data?.fixedPrice,
      <div
        key={inputErrors[index]}
        style={{ display: "flex", justifyContent: "center" }}
      >
        <GoMakeTextInput
          key={inputErrors[index]}
          style={{
            height: 40,
            ...adaptPaddingRight(direction, 20),
            width: "90%",
          }}
          id={`priceInput-${index}`}
          type="number"
          value={data.price || ""}
          onChange={(e) => handlePriceChange(index, e.target.value)}
          error={inputErrors[index]}
          InputProps={{
            inputProps: { min: data.fixedPrice < 0 ? data.fixedPrice : 0 },
          }}
        />
      </div>,
    ]);
  }, [clientPaymentsList, inputErrors]);

  const onClickMatchItems = () => {
    if (hasInputErrors()) {
      alertFault("reports.inputErrorAlert");
      return;
    }

    if (selectedItems.length > 0 && calculateTotalPrice() === 0) {
      internalReconciliationApi();
    } else if (selectedItems.length > 0 && calculateTotalPrice() !== 0) {
      alertFault("reports.matchTotalZeroErrorMsg");
    } else {
      alertFault("reports.matchErrorMsg");
    }
  };

  const btns = [
    {
      name: t("reports.match"),
      onclick: onClickMatchItems,
    },
    {
      name: t("reports.balanceCancellation"),
      onclick: onClickOpenDeleteModal,
    },
    {
      name: t("reports.transferBalance"),
      onclick: onClickOpenTransferModal,
    },
  ];

  const cancelTransactionsApi = useCallback(async () => {
    const res = await callApi(
      EHttpMethod.PUT,
      `/v1/erp-service/receipts/cancel-balance`,
      {
        clientId: customerId ?? "",
        total: calculateTotalPrice(),
        openTrans: selectedItems,
      }
    );
    if (res?.success) {
      getClientPaymentItems();
    } else {
      alertFaultDelete();
    }
  }, [selectedItems]);

  const transferBalanceApi = useCallback(async () => {
    const res = await callApi(
      EHttpMethod.PUT,
      `/v1/erp-service/receipts/move-balance`,
      {
        clientId: customerId ?? "",
        total: calculateTotalPrice(),
        clientIdToMove: customer.id,
        openTrans: selectedItems,
      }
    );
    if (res?.success) {
      alertSuccess(`reports.successfullyMovedTransaction`);
      getClientPaymentItems();
    } else {
      alertFault("reports.failedMoveTransaction");
    }
  }, [selectedItems, customer]);

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
    isFetching,
    inputErrors,
    setSelectedItems,
  };
};

export { useAdjustmentsModal };
