import { useTranslation } from "react-i18next";
import { GoMakeModal, GomakePrimaryButton } from "@/components";

import { useStyle } from "./style";
import { getDocumentPdfApi } from "@/services/api-service/generic-doc/documents-api";
import { useGomakeAxios, useGomakeRouter, useSnackBar } from "@/hooks";
import { useRecoilState } from "recoil";
import { quoteItemState } from "@/store";
import { DOCUMENT_TYPE } from "@/pages-components/quotes/enums";

const InvoiceCreationModal = ({ openModal, onClose, docType, handleSendBtnClick, }: {
  openModal: boolean;
  onClose: () => void;
  docType: any;
  handleSendBtnClick: any;
}) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const { callApi } = useGomakeAxios();
  const { alertFaultGetData } = useSnackBar();
  const { navigate } = useGomakeRouter();
  const [quoteItemValue, setQuoteItemValue] = useRecoilState<any>(quoteItemState);
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
        downloadPdf(pdfLink)
      } else {
        alertFaultGetData();
      }
    };
    await getDocumentPdfApi(callApi, callBack, { documentId: quoteItemValue?.id, documentType: docType });
  };
  return (
    <>
      <GoMakeModal
        openModal={openModal}
        modalTitle={t("sales.quote.modalCreatedTitle", { documentPath })}
        onClose={onClose}
        insideStyle={clasess.insideStyle}
      >
        <div style={clasess.mainContainer}>
          <div style={clasess.titleContainer}>{t("sales.quote.modalCreatedFirstTitle", { documentPath })}</div>
          <div style={clasess.btnsContainer}>
            <GomakePrimaryButton onClick={handleSendBtnClick} style={clasess.btnStyle}>{t("login.send")}</GomakePrimaryButton>
            <GomakePrimaryButton onClick={() => onClickPrint()} style={clasess.btnStyle}> {t("sales.quote.print")}</GomakePrimaryButton>
            <GomakePrimaryButton onClick={() => navigate(`/receipt?isNewCreation=true&documentNumber=${quoteItemValue?.number}&ClientId=${quoteItemValue?.customerID}`)} style={clasess.btnStyle}>{t("sales.quote.pay")}</GomakePrimaryButton>
            <GomakePrimaryButton onClick={() => {
              navigate(`/${documentPath}?isNewCreation=true`)
              onClose()
              setQuoteItemValue({})
            }} style={clasess.btnStyle}>{t("sales.quote.createNew")}</GomakePrimaryButton>
          </div>
        </div>
      </GoMakeModal>
    </>
  );
};
export { InvoiceCreationModal };
