import { GoMakeMenu } from "@/components";
import { useGomakeRouter } from "@/hooks/use-gomake-router";
import { DOCUMENT_TYPE } from "@/pages-components/quotes/enums";
import {
  isSelectedCLoseAsDeliveryNoteState,
  isSelectedCLoseAsProformaInvoiceState,
} from "@/pages/customers/customer-states";
import { MenuItem } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useSetRecoilState } from "recoil";

interface ICloseMenuProps {
  handleClose: () => void;
  open: boolean;
  anchorEl: null | HTMLElement;
  documentState: any;
  documentType: DOCUMENT_TYPE;
  onClickClose: (id: string) => void;
  onClickOpenChangeProductionStatusModal?: any;
  onClickOpenCloseOrderNotesModal?: any;
}

const CloseBtnMenu = ({
  handleClose,
  open,
  anchorEl,
  documentState,
  documentType,
  onClickClose,
  onClickOpenChangeProductionStatusModal,
  onClickOpenCloseOrderNotesModal,
}: ICloseMenuProps) => {
  const { t } = useTranslation();
  const { navigate } = useGomakeRouter();
  const setIsSelectedCLoseAsDeliveryNote = useSetRecoilState(
    isSelectedCLoseAsDeliveryNoteState
  );
  const setIsSelectedCLoseAsProformaInvoice = useSetRecoilState(
    isSelectedCLoseAsProformaInvoiceState
  );

  const getMenuOptions = () => {
    switch (documentType) {
      case DOCUMENT_TYPE.order:
        return [
          {
            label: t("sales.quote.close"),
            action: () => {
              if (documentState?.closeOrderNotes?.trim()) {
                onClickOpenCloseOrderNotesModal(() =>
                  onClickClose(documentState?.id)
                );
              } else onClickClose(documentState?.id);
            },
          },
          {
            label: t("sales.quote.closeAsDeliveryNote"),
            action: () => {
              if (documentState?.productionStatus) {
                if (documentState?.closeOrderNotes?.trim()) {
                  onClickOpenCloseOrderNotesModal(() =>
                    navigate(
                      `/deliveryNote?isNewCreation=true&orderId=${documentState?.id}`
                    )
                  );
                } else
                  navigate(
                    `/deliveryNote?isNewCreation=true&orderId=${documentState?.id}`
                  );
              } else {
                onClickOpenChangeProductionStatusModal(documentState);
                setIsSelectedCLoseAsDeliveryNote(true);
                setIsSelectedCLoseAsProformaInvoice(false);
              }
            },
          },
          {
            label: t("sales.quote.closeAsProformaInvoice"),
            action: () => {
              if (documentState?.productionStatus) {
                if (documentState?.closeOrderNotes?.trim()) {
                  onClickOpenCloseOrderNotesModal(() =>
                    navigate(
                      `/proformaInvoice?isNewCreation=true&orderId=${documentState?.id}`
                    )
                  );
                } else
                  navigate(
                    `/proformaInvoice?isNewCreation=true&orderId=${documentState?.id}`
                  );
              } else {
                onClickOpenChangeProductionStatusModal(documentState);
                setIsSelectedCLoseAsDeliveryNote(false);
                setIsSelectedCLoseAsProformaInvoice(true);
              }
            },
          },
          {
            label: t("sales.quote.closeAsInvoice"),
            action: () => {
              if (documentState?.productionStatus) {
                if (documentState?.closeOrderNotes?.trim()) {
                  onClickOpenCloseOrderNotesModal(() =>
                    navigate(
                      `/invoice?isNewCreation=true&orderId=${documentState?.id}`
                    )
                  );
                } else
                  navigate(
                    `/invoice?isNewCreation=true&orderId=${documentState?.id}`
                  );
              } else {
                onClickOpenChangeProductionStatusModal(documentState);
                setIsSelectedCLoseAsDeliveryNote(false);
                setIsSelectedCLoseAsProformaInvoice(false);
              }
            },
          },
        ];
      case DOCUMENT_TYPE.deliveryNote:
        return [
          {
            label: t("sales.quote.close"),
            action: () => onClickClose(documentState?.id),
          },
          {
            label: t("sales.quote.closeAsProformaInvoice"),
            action: () =>
              navigate(
                `/proformaInvoice?isNewCreation=true&deliveryNoteId=${documentState?.id}`
              ),
          },
          {
            label: t("sales.quote.closeAsInvoice"),
            action: () =>
              navigate(
                `/invoice?isNewCreation=true&deliveryNoteId=${documentState?.id}`
              ),
          },
          {
            label: t("sales.quote.createDeliveryNoteRefund"),
            action: () =>
              navigate(
                `/deliveryNoteRefund?isNewCreation=true&documentId=${documentState?.id}`
              ),
          },
        ];
      case DOCUMENT_TYPE.invoice:
        return [
          {
            label: t("sales.quote.close"),
            action: () => onClickClose(documentState?.id),
          },
          {
            label: t("sales.quote.createInvoiceRefund"),
            action: () =>
              navigate(
                `/invoiceRefund?isNewCreation=true&documentId=${documentState?.id}`
              ),
          },
        ];
      case DOCUMENT_TYPE.purchaseOrder:
        return [
          {
            label: t("sales.quote.close"),
            action: () => {
              onClickClose(documentState?.id);
            },
          },

          {
            label: t("sales.quote.closeAsPurchaseInvoice"),
            action: () =>
              navigate(
                `/purchaseInvoice?isNewCreation=true&orderId=${documentState?.id}`
              ),
          },
        ];
      case DOCUMENT_TYPE.purchaseInvoice:
        return [
          {
            label: t("sales.quote.closeAsPurchaseInvoiceRefund"),
            action: () =>
              navigate(
                `/purchaseInvoiceRefund?isNewCreation=true&documentId=${documentState?.id}`
              ),
          },
        ];
      case DOCUMENT_TYPE.proformaInvoice:
        return [
          {
            label: t("sales.quote.close"),
            action: () => onClickClose(documentState?.id),
          },
          {
            label: t("sales.quote.closeAsInvoice"),
            action: () =>
              navigate(
                `/invoice?isNewCreation=true&proformaInvoiceId=${documentState?.id}`
              ),
          },
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
      sx={{
        "& .MuiPaper-root": {
          border: "1px solid #cbcbe4",
          borderRadius: "8px",
        },
      }}
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
