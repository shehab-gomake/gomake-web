import { useTranslation } from "react-i18next";
import { GoMakeModal, GomakePrimaryButton } from "@/components";

import { useStyle } from "./style";
import { useRef } from "react";
import SignatureCanvas from 'react-signature-canvas';
import { CloseIcon } from "@/components/modal/icon/close";

const ApproveSignatureModal = ({ openModal, onClose, onClickApprove }: any) => {
  const sigPad = useRef(null);
  const clear = () => {
    sigPad.current.clear();
  };

  const save = () => {
    const dataURL = sigPad.current.getTrimmedCanvas().toDataURL('image/png');
    console.log(dataURL); // You can send this to your server or save it in the state
    onClickApprove()
  };
  const { t } = useTranslation();
  const { clasess } = useStyle();
  return (
    <>
      <GoMakeModal
        openModal={openModal}
        modalTitle="Approved Signature"
        onClose={onClose}
        insideStyle={clasess.insideStyle}
      >
        <div style={clasess.mainContainer}>
          <div style={clasess.nameContainer}>
            <div>You Name</div>
            <input
              placeholder={"Enter your name"}
              style={clasess.textInputStyle}
              onChange={(e: any) => {
                console.log("DDD", e.target.value);
              }}
            />
          </div>
          <div style={clasess.signatureContainer}>
            <SignatureCanvas
              ref={sigPad}
              penColor="black"
              canvasProps={{ width: 500, height: 200, className: 'sigCanvas' }}
            />
            <div onClick={clear} style={clasess.clearBtn}>
              <CloseIcon />
            </div>
          </div>
          <div style={clasess.descriptionContainer}>
            By providing my electronic signature above, I confirm my understanding and agreement with the terms and conditions stated herein. I acknowledge that my electronic signature is legally binding.
          </div>
          <div style={clasess.btnsContainer}>
            {/* <GomakePrimaryButton style={clasess.clearBtn} onClick={clear}>Clear</GomakePrimaryButton> */}
            <GomakePrimaryButton style={clasess.saveBtn} onClick={save}>Confirm & Approve Offer</GomakePrimaryButton>
          </div>

        </div>
      </GoMakeModal>
    </>
  );
};
export { ApproveSignatureModal };
