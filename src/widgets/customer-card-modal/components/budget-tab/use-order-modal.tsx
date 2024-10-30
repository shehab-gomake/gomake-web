import { useState } from "react";
import { CheckboxCheckedIcon, CheckboxIcon } from "@/icons";
import { Checkbox } from "@mui/material";
import { DOCUMENT_TYPE } from "@/pages-components/quotes/enums";
import { DeleteIcon } from "@/widgets/settings-mailing/messageTemplates/components/more-circle/icons/delete";


const useOrderModal = ({ allDocuments, onClose, allDocumentsByBudget }) => {
  // State to manage switching between modals
  const [isClientOrdersModalOpen, setIsClientOrdersModalOpen] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState([]);

  // Table headers for the current budget's orders
  const ordersTableHeaders = ["Document Number", "Document Type", "Total Price Without VAT", "Total Price", "More"];

  // Table headers for client's orders selection modal
  const clientOrdersTableHeaders = ["#", "Document Number", "Document Type", "Total Price Without VAT", "Total Price"];

  // Mapping orders for the current budget modal
  const mapOrdersData = () => allDocuments?.map(document => [
    document.documentNumber,
    DOCUMENT_TYPE[document.documentType],
    document.totalPaymentBeforeVat,
    document.totalPayment,
    <div style={{ cursor: "pointer" }}><DeleteIcon /></div>
  ]);

  // Mapping client's orders data for selection
  const mapClientOrdersData = () => allDocumentsByBudget.map(order => [
    <Checkbox
      checked={selectedOrders.includes(order.number)}
      onChange={(e) => handleSelectOrder(e, order.number)}
      icon={<CheckboxIcon />}
      checkedIcon={<CheckboxCheckedIcon />}
    />,
    order.number,
    DOCUMENT_TYPE[order.documentStatus],
    order.totalPaymentBeforeVat,
    order.totalPayment,
  ]);

  // Handling selection of orders
  const handleSelectOrder = (e, orderNumber) => {
    if (e.target.checked) {
      setSelectedOrders([...selectedOrders, orderNumber]);
    } else {
      setSelectedOrders(selectedOrders.filter(order => order !== orderNumber));
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

  return {
    handleClose,
    handleClientOrdersClick,
    mapOrdersData,
    mapClientOrdersData,
    isClientOrdersModalOpen,
    ordersTableHeaders,
    clientOrdersTableHeaders
  };
};

export { useOrderModal };