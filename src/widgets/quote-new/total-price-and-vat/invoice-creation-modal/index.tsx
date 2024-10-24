import { useTranslation } from "react-i18next";
import { GoMakeModal } from "@/components";
import { useStyle } from "./style";
import { getDocumentPdfApi } from "@/services/api-service/generic-doc/documents-api";
import { useGomakeAxios, useGomakeRouter, useSnackBar } from "@/hooks";
import { useRecoilValue } from "recoil";
import { quoteItemState } from "@/store";
import { DOCUMENT_TYPE } from "@/pages-components/quotes/enums";
import { PrimaryButton } from "@/components/button/primary-button";
import { capitalizeFirstLetter } from "@/utils/helpers";

const InvoiceCreationModal = ({
  openModal,
  onClose,
  docType,
  onClickSendDocumentToClient,
}: {
  openModal: boolean;
  onClose: () => void;
  docType: any;
  onClickSendDocumentToClient: (value: number) => void;
}) => {
  const { t } = useTranslation();
  const { classes } = useStyle();
  const { callApi } = useGomakeAxios();
  const { alertFaultGetData } = useSnackBar();
  const { navigate } = useGomakeRouter();
  const quoteItemValue = useRecoilValue<any>(quoteItemState);
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

  return (
    <>
      <GoMakeModal
        openModal={openModal}
        modalTitle={" "}
        onClose={onClose}
        insideStyle={classes.insideStyle}
      >
        <div style={classes.mainContainer}>
          <div style={classes.titleContainer}>
            {t("sales.quote.modalCreatedFirstTitle", {
              documentPath: t(
                `documentTitlesWithThe.the${capitalizeFirstLetter(
                  documentPath
                )}`
              ).toLowerCase(),
            })}
          </div>
          <div style={classes.btnsContainer}>
            <PrimaryButton
              hoverStyle={true}
              variant={"contained"}
              onClick={() => {
                onClickSendDocumentToClient(1);
                onClose();
              }}
              style={classes.btnStyle}
            >
              {t("sales.quote.sendToPhone")}
            </PrimaryButton>
            <PrimaryButton
              hoverStyle={true}
              variant={"contained"}
              onClick={() => {
                onClickSendDocumentToClient(1);
                onClose();
              }}
              style={classes.btnStyle}
            >
              {t("sales.quote.sendToPhone")}
            </PrimaryButton>

            <PrimaryButton
              hoverStyle={true}
              variant={"contained"}
              onClick={() => onClickSendDocumentToClient(0)}
              style={classes.btnStyle}
            >
              {t("sales.quote.sendToEmail")}
            </PrimaryButton>
            <PrimaryButton
              hoverStyle={true}
              variant={"contained"}
              onClick={() => onClickPrint()}
              style={classes.btnStyle}
            >
              {t("sales.quote.print")}
            </PrimaryButton>
            <PrimaryButton
              hoverStyle={true}
              variant={"contained"}
              onClick={() =>
                navigate(
                  `/receipt?isNewCreation=true&documentNumber=${quoteItemValue?.number}&ClientId=${quoteItemValue?.customerID}`
                )
              }
              style={classes.btnStyle}
            >
              {t("sales.quote.pay")}
            </PrimaryButton>
            <PrimaryButton
              hoverStyle={true}
              variant={"contained"}
              onClick={() => {
                navigate(`/${documentPath}?isNewCreation=true`);
                onClose();
              }}
              style={classes.btnStyle}
            >
              {t("sales.quote.createNew")}
            </PrimaryButton>
          </div>
        </div>
      </GoMakeModal>
    </>
  );
};
export { InvoiceCreationModal };
