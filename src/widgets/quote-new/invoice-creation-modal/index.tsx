import { GoMakeModal } from "@/components";
import { useRecoilValue } from "recoil";
import { quoteItemState } from "@/store";
import { useStyle } from "./style";
import { FONT_FAMILY } from "@/utils/font-family";
import { useTranslation } from "react-i18next";
import { SendInvoiceSection } from "./components/send-invoice-section";
import { OtherOptionsSection } from "./components/other-option-section";

interface InvoiceCreationModal {
  openModal: boolean;
  onClose: () => void;
  docType: any;
  onClickSendDocumentToClient: (value) => void;
}

const InvoiceCreationModal = ({
  openModal,
  onClose,
  docType,
  onClickSendDocumentToClient,
}: InvoiceCreationModal) => {
  const { classes } = useStyle();
  const { t } = useTranslation();
  const quoteItemValue = useRecoilValue<any>(quoteItemState);

  return (
    <>
      <GoMakeModal
        openModal={openModal}
        modalTitle={t("sales.modals.proceedToCreateInvoice")}
        onClose={onClose}
        modalTitleStyle={{
          ...FONT_FAMILY.Inter(600, 18),
          paddingBottom: "20px",
        }}
        modalTitleColor={"#000000"}
        withRoundedCloseIcon={false}
        insideStyle={classes.insideStyle}
      >
        <div style={classes.mainContainer}>
          <SendInvoiceSection
            handleSendDocument={onClickSendDocumentToClient}
          />
          <OtherOptionsSection
            quoteItemValue={quoteItemValue}
            docType={docType}
            onClose={onClose}
          />
        </div>
      </GoMakeModal>
    </>
  );
};
export { InvoiceCreationModal };
