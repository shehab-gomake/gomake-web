import { Button, Stack } from "@mui/material";
import { useTranslation } from "react-i18next";
import { CreateIcon, PayIcon, PrinterIcon, TickIcon } from "./icons";
import { useStyle } from "../style";
import { useGomakeAxios, useGomakeRouter, useSnackBar } from "@/hooks";
import { getDocumentPdfApi } from "@/services/api-service/generic-doc/documents-api";
import { DOCUMENT_TYPE } from "@/pages-components/quotes/enums";
import {
  getReceiptInvoicesPdfApi,
  getReceiptPdfApi,
} from "@/services/api-service/generic-doc/receipts-api";
import { useState } from "react";
import { ThreeOptionsModal } from "@/components";
import { DeliveriesIcon } from "@/icons/side-list-icons/deliveries";

interface OtherOptionsSectionProps {
  quoteItemValue: any;
  docType: any;
  onClose: () => void;
  isOutgoingPayments: boolean;
}

const OtherOptionsSection = ({
  quoteItemValue,
  docType,
  onClose,
  isOutgoingPayments,
}: OtherOptionsSectionProps) => {
  const { t } = useTranslation();
  const { classes } = useStyle();
  const { navigate } = useGomakeRouter();
  const { alertFaultGetData } = useSnackBar();
  const { callApi } = useGomakeAxios();
  const documentPath = DOCUMENT_TYPE[docType];
  const isReceipt = docType === DOCUMENT_TYPE.receipt;
  const isDeliveryNote = docType === DOCUMENT_TYPE.deliveryNote;
  const isInvoice = docType === DOCUMENT_TYPE.invoice;

  const [openExportPdfModal, setOpenExportPdfModal] = useState<boolean>(false);

  const onOpenExportPdfModal = () => {
    setOpenExportPdfModal(true);
  };

  const onCloseExportPdfModal = () => {
    setOpenExportPdfModal(false);
  };

  const onClickPrint = async (withInvoices?: boolean) => {
    const downloadPdf = (url) => {
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.target = "_blank";
      anchor.addEventListener("click", () => {
        setTimeout(() => {
          anchor.remove();
        }, 100);
      });
      anchor.click();
    };
    const callBack = (res) => {
      if (res?.success) {
        const pdfLink = res.data;
        window.open(pdfLink, "_blank");
        // downloadPdf(pdfLink);
      } else {
        alertFaultGetData();
      }
    };
    if (isReceipt) {
      if (withInvoices)
        await getReceiptInvoicesPdfApi(callApi, callBack, {
          receiptId: quoteItemValue?.id,
        });
      else
        await getReceiptPdfApi(callApi, callBack, {
          receiptId: quoteItemValue?.id,
        });
    } else {
      await getDocumentPdfApi(callApi, callBack, {
        documentId: quoteItemValue?.id,
        documentType: docType,
      });
    }
  };

  const onClickPay = () =>
    navigate(
      `/receipt?isNewCreation=true&documentNumber=${quoteItemValue?.accountingNumber}&ClientId=${quoteItemValue?.customerID}`
    );

  const onClickProceedToDelivery = () => {
    navigate(
      `/orders?deliveryOrderId=${quoteItemValue?.orderIdForDeliveryCreation}&deliveryCustomerId=${quoteItemValue?.customerID}&deliveryOrderNumber=${quoteItemValue?.number}`
    );
  };

  const onClickCloseAsInvoice = () =>
    navigate(
      `/invoice?isNewCreation=true&deliveryNoteId=${quoteItemValue?.id}`
    );

  const onClickCreateNewInvoice = () => {
    const queryParams = isOutgoingPayments
      ? "?isOutgoingPayments=true&isNewCreation=true"
      : "?isNewCreation=true";
    navigate(`/${documentPath}${queryParams}`);
    onClose();
  };

  const getCreateButtonText = () => {
    switch (docType) {
      case DOCUMENT_TYPE.deliveryNote:
        return t("sales.modals.createNewDeliveryNote");
      case DOCUMENT_TYPE.invoice:
        return t("sales.modals.createNewInvoice");
      case DOCUMENT_TYPE.receipt:
        return isOutgoingPayments
          ? t("sales.modals.createNewPayment")
          : t("sales.modals.createNewReceipt");
      default:
        return t("sales.modals.createNewDocument");
    }
  };

  const handleClickPrint = () => {
    if (isReceipt) {
      onOpenExportPdfModal();
    } else onClickPrint();
  };

  const [isHovering, setIsHovering] = useState(false);

  return (
    <Stack direction={"column"} gap={"10px"} width={"100%"}>
      <span style={classes.sectionTitle}>{t("sales.modals.otherOptions")}</span>
      {!!quoteItemValue?.orderIdForDeliveryCreation && (
        <Button
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          sx={classes.delBtn}
          onClick={onClickProceedToDelivery}
          startIcon={
            <DeliveriesIcon color={isHovering ? "#10B981" : "#10B981"} />
          }
        >
          {t("sales.modals.proceedToDelivery")}
        </Button>
      )}
      <Button
        sx={classes.optionsButtons}
        onClick={handleClickPrint}
        startIcon={<PrinterIcon />}
      >
        {t("sales.modals.print")}
      </Button>

      {isDeliveryNote && (
        <Button
          sx={classes.optionsButtons}
          onClick={onClickCloseAsInvoice}
          startIcon={<TickIcon />}
        >
          {t("sales.quote.closeAsInvoice")}
        </Button>
      )}
      {isInvoice && (
        <Button
          sx={classes.optionsButtons}
          onClick={onClickPay}
          startIcon={<PayIcon />}
        >
          {t("sales.modals.pay")}
        </Button>
      )}
      <Button
        sx={classes.optionsButtons}
        onClick={onClickCreateNewInvoice}
        startIcon={<CreateIcon />}
      >
        {getCreateButtonText()}
      </Button>

      <ThreeOptionsModal
        hideIcon
        title={t("sales.modals.printReceipt")}
        subTitle={t("sales.modals.includeInvoicesPdfPrompt")}
        yesBtn={"sales.modals.withInvoices"}
        noBtn={"sales.modals.withoutInvoices"}
        openModal={openExportPdfModal}
        onClose={onCloseExportPdfModal}
        onClickYes={() => onClickPrint(true)}
        onClickNo={() => onClickPrint(false)}
      />
    </Stack>
  );
};

export { OtherOptionsSection };
