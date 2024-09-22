import { GoMakeMenu } from "@/components";
import { useGomakeRouter } from "@/hooks/use-gomake-router";
import { DOCUMENT_TYPE } from "@/pages-components/quotes/enums";
import { MenuItem } from "@mui/material";
import { useTranslation } from "react-i18next";

const CloseBtnMenu = ({
  handleClose,
  open,
  anchorEl,
  documentState,
  documentType,
  onClickClose
}) => {
  const { t } = useTranslation();
  const { navigate } = useGomakeRouter();

  // condition: (isOrder && quote?.isCanClose && quote?.statusTitleText !== "Order.Canceled") || (isDeliveryNote && quote?.isCanClose) || (isInvoice && quote?.isCanClose),
  // onClick: () => quote?.closeOrderNotes && quote?.closeOrderNotes.tirm !== "" ? onClickOpenCloseOrderNotesModal(quote) : onClickOpenCloseOrderModal(quote),

  const getMenuOptions = () => {
    switch (documentType) {
      case DOCUMENT_TYPE.order:
        return [
          { label: t("sales.quote.close"), action: () => onClickClose(documentState?.id) },
          { label: t("sales.quote.closeAsDeliveryNote"), action: () => navigate(`/deliveryNote?isNewCreation=true&orderId=${documentState?.id}`) },
          { label: t("sales.quote.closeAsInvoice"), action: () => { navigate(`/invoice?isNewCreation=true&orderId=${documentState?.id}`) } }
        ];
      case DOCUMENT_TYPE.deliveryNote:
        return [
          { label: t("sales.quote.close"), action: () => onClickClose(documentState?.id) },
          { label: t("sales.quote.closeAsInvoice"), action: () => navigate(`/invoice?isNewCreation=true&deliveryNoteId=${documentState?.id}`) },
          { label: t("sales.quote.createDeliveryNoteRefund"), action: () => navigate(`/deliveryNoteRefund?isNewCreation=true&documentId=${documentState?.id}`) }
        ];
      case DOCUMENT_TYPE.invoice:
        return [
          { label: t("sales.quote.close"), action: () => onClickClose(documentState?.id) },
          { label: t("sales.quote.createInvoiceRefund"), action: () => navigate(`/invoiceRefund?isNewCreation=true&documentId=${documentState?.id}`) }
        ];
      default:
        return [];
    }
  };

  const menuOptions = getMenuOptions();
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };
  return (
    <GoMakeMenu
      handleClose={handleClose}
      open={open}
      anchorEl={anchorEl}
      style={{ marginTop: -45 }}
    >
      {menuOptions.map((option, index) => (
        <MenuItem
          key={index}
          onClick={() => {
            option.action();
            handleClose();
          }}
        >
          {capitalizeFirstLetter(option.label)}
        </MenuItem>
      ))}
    </GoMakeMenu>
  );
};

export { CloseBtnMenu };