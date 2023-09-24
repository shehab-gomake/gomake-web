import { useTranslation } from "react-i18next";
import {
  GoMakeModal,
  GomakePrimaryButton,
  GomakeTextInput,
} from "@/components";

import { useStyle } from "./style";
import { useRecoilValue } from "recoil";
import { quoteState } from "@/pages-components/quote/store/quote";

const AddNegotiateRequestModal = () => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const quoteStateValue = useRecoilValue<any>(quoteState);
  //change openModal onClose
  return (
    <>
      <GoMakeModal
        openModal={quoteStateValue?.openNegotiateRequestModal}
        modalTitle={t("sales.quote.negotiateRequest")}
        onClose={() => quoteStateValue?.onCloseNegotiateRequest()}
        insideStyle={clasess.insideStyle}
      >
        <div>
          <GomakeTextInput
            multiline={6}
            style={clasess.textInputStyle}
            placeholder={t("sales.quote.sendNegotiateRequest")}
          />
          <div style={clasess.btnContainer}>
            <GomakePrimaryButton style={clasess.sendBtn}>
              Send
            </GomakePrimaryButton>
          </div>
        </div>
      </GoMakeModal>
    </>
  );
};
export { AddNegotiateRequestModal };
