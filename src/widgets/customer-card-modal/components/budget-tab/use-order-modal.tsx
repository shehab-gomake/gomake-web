import { useCallback, useState } from "react";
import { CheckboxCheckedIcon, CheckboxIcon } from "@/icons";
import { Checkbox } from "@mui/material";
import { DOCUMENT_TYPE } from "@/pages-components/quotes/enums";
import { DeleteIcon } from "@/widgets/settings-mailing/messageTemplates/components/more-circle/icons/delete";
import { EHttpMethod } from "@/services/api-service/enums";
import { useGomakeAxios, useSnackBar } from "@/hooks";
import { useTranslation } from "react-i18next";


const useOrderModal = ({ allDocuments, onClose, allDocumentsByBudget, updateDocumentBudget, selectedBudget }) => {
  // State to manage switching between modals
  const { callApi } = useGomakeAxios();
  const { t } = useTranslation();
  const { alertSuccessUpdate, alertFaultUpdate, alertFault } = useSnackBar();
  const [isClientOrdersModalOpen, setIsClientOrdersModalOpen] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState([]);
  // Table headers for the current budget's orders
  const ordersTableHeaders = [
    t("home.headers.documentNumber"),
    t("documentingDesign.documnetCreation.docmentType"),
    t("home.headers.totalPriceWithoutVat"),
    t("reports.totalPrice"),
    t("properties.more")
  ];

  // Table headers for client's orders selection modal
  const clientOrdersTableHeaders = [
    "#",
    t("home.headers.documentNumber"),
    t("documentingDesign.documnetCreation.docmentType"),
    t("home.headers.totalPriceWithoutVat"),
    t("reports.totalPrice")
  ];

  const handleDeleteOrder = (document) => {
    updateDocumentBudget(document)
  }

  // Mapping orders for the current budget modal
  const mapOrdersData = () => allDocuments?.map(document => [
    document.documentNumber,
    DOCUMENT_TYPE[document.documentType],
    document.totalPaymentBeforeVat,
    document.totalPayment,
    <div onClick={() => handleDeleteOrder(document)} style={{ cursor: "pointer" }}><DeleteIcon /></div>
  ]);

  // Mapping client's orders data for selection
  const mapClientOrdersData = () => allDocumentsByBudget.map(order => [
    <Checkbox
      checked={selectedOrders.some(selected => selected.documentId === order.id)}
      onChange={(e) => handleSelectOrder(e, order)}
      icon={<CheckboxIcon />}
      checkedIcon={<CheckboxCheckedIcon />}
    />,
    order.number,
    DOCUMENT_TYPE[order.documentType],
    order.totalPriceWithoutVat,
    order.totalPrice,
  ]);

  // Handling selection of orders
  const handleSelectOrder = (e, order) => {
    if (e.target.checked) {
      setSelectedOrders([...selectedOrders, { documentId: order?.id, documentType: order?.documentType }]);
    } else {
      setSelectedOrders(selectedOrders.filter(selected => selected.documentId !== order.id));
    }
  };

  // Handle button click to switch to the client's orders modal
  const handleClientOrdersClick = () => {
    setIsClientOrdersModalOpen(true);
  };

  // Handle closing both modals
  const handleClose = () => {
    setIsClientOrdersModalOpen(false);
    onClose();
  };

  const updateDocumentsBudget = useCallback(async () => {
    const res = await callApi(
      EHttpMethod.PUT,
      `/v1/erp-service/budgets/update-documents-budget`,
      {
        budgetId: selectedBudget?.id,
        documents: selectedOrders
      }
    );
    if (res?.success) {
      alertSuccessUpdate();
      onClose();
    } else {
      if (res?.errors?.statusCode === 107) {
        alertFault(t(`documentingDesign.${res?.errors?.message}`));
      }
      else {
        alertFaultUpdate();


      }

    }
  }, [selectedBudget, selectedOrders]);

  return {
    handleClose,
    handleClientOrdersClick,
    mapOrdersData,
    mapClientOrdersData,
    updateDocumentsBudget,
    isClientOrdersModalOpen,
    ordersTableHeaders,
    clientOrdersTableHeaders
  };
};

export { useOrderModal };