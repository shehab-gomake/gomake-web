import { useTranslation } from "react-i18next";
import {
  GoMakeModal,
  GomakePrimaryButton,
  GomakeTextInput,
} from "@/components";

import { useStyle } from "./style";
import { useRecoilValue } from "recoil";
import { quoteItemState } from "@/store";

const ViewSignatureApprovalModal = ({
  openModal,
  onClose,
}: {
  openModal: boolean;
  onClose: () => void;

}) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const quoteItemValue = useRecoilValue<any>(quoteItemState);

  return (
    <>
      <GoMakeModal
        openModal={openModal}
        modalTitle={t("modal.signatureApproval")}
        onClose={onClose}
        insideStyle={clasess.insideStyle}
      >
        <div style={clasess.mainContainer}>
          <div style={clasess.signerNameContainer}>
            <div style={clasess.labelStyle}>Signatory</div>
            <div style={clasess.signerNameStyle}>{quoteItemValue?.signerName}</div>
          </div>
          <div>
            <div style={clasess.labelStyle}>Signature</div>
            <img src={quoteItemValue?.signImageUrl} />
          </div>
        </div>
      </GoMakeModal>
    </>
  );
};
export { ViewSignatureApprovalModal };
