import { Button, Stack } from "@mui/material";
import { useTranslation } from "react-i18next";
import { CreateIcon, PayIcon, PrinterIcon } from "./icons";
import { useStyle } from "../style";
import { useGomakeAxios, useGomakeRouter, useSnackBar } from "@/hooks";
import { getDocumentPdfApi } from "@/services/api-service/generic-doc/documents-api";
import { DOCUMENT_TYPE } from "@/pages-components/quotes/enums";

interface OtherOptionsSectionProps {
  quoteItemValue: any;
  docType: any;
  onClose: () => void;
}

const OtherOptionsSection = ({
  quoteItemValue,
  docType,
  onClose,
}: OtherOptionsSectionProps) => {
  const { t } = useTranslation();
  const { classes } = useStyle();
  const { navigate } = useGomakeRouter();
  const { alertFaultGetData } = useSnackBar();
  const { callApi } = useGomakeAxios();
  const documentPath = DOCUMENT_TYPE[docType];

  const onClickPrint = async () => {
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
        downloadPdf(pdfLink);
      } else {
        alertFaultGetData();
      }
    };
    await getDocumentPdfApi(callApi, callBack, {
      documentId: quoteItemValue?.id,
      documentType: docType,
    });
  };

  const onClickPay = () =>
    navigate(
      `/receipt?isNewCreation=true&documentNumber=${quoteItemValue?.number}&ClientId=${quoteItemValue?.customerID}`
    );

  const onClickCreateNewInvoice = () => {
    navigate(`/${documentPath}?isNewCreation=true`);
    onClose();
  };

  return (
    <Stack direction={"column"} gap={"10px"} width={"100%"}>
      <span style={classes.sectionTitle}>{t("sales.modals.otherOptions")}</span>
      <Button
        style={classes.optionsButtons}
        onClick={onClickPrint}
        startIcon={<PrinterIcon />}
      >
        {t("sales.modals.print")}
      </Button>
      <Button
        style={classes.optionsButtons}
        onClick={onClickPay}
        startIcon={<PayIcon />}
      >
        {t("sales.modals.pay")}
      </Button>
      <Button
        style={classes.optionsButtons}
        onClick={onClickCreateNewInvoice}
        startIcon={<CreateIcon />}
      >
        {t("sales.modals.createNewInvoice")}
      </Button>
    </Stack>
  );
};

export { OtherOptionsSection };
