import { useTranslation } from "react-i18next";
import { GoMakeModal, GomakePrimaryButton, GomakeTextInput } from "@/components";

import { useStyle } from "./style";
import { DateFormatterDDMMYYYY } from "@/utils/adapter";
import { useRef, useState } from "react";
import SignatureCanvas from 'react-signature-canvas';

const ApproveSignatureModal = ({ openModal, onClose }: any) => {
  const [selectDate, setSelectDate] = useState<any>("");
  const dateRef = useRef(null);
  const sigPad = useRef(null);
  const clear = () => {
    sigPad.current.clear();
  };

  const save = () => {
    const dataURL = sigPad.current.getTrimmedCanvas().toDataURL('image/png');
    console.log(dataURL); // You can send this to your server or save it in the state
  };
  const [activeClickAway, setActiveClickAway] = useState(false);
  const handleClickSelectDate = () => {
    dateRef?.current?.showPicker();
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
          <input
            placeholder={"Enter your name"}
            style={clasess.textInputStyle}
            onChange={(e: any) => {
              console.log("DDD", e.target.value);
            }}
          />
          <div
            style={clasess.deleverdDate}
            onClick={handleClickSelectDate}
          >
            {selectDate
              ? DateFormatterDDMMYYYY(String(selectDate))
              : "DD/MM/YYYY"}
            <div style={clasess.datePickerContainer}>
              <input
                type="datetime-local"
                onChange={(e) => {
                  setSelectDate(e.target.value);
                  setActiveClickAway(true);
                }}
                ref={dateRef}
              />
            </div>
          </div>
          <div style={clasess.signatureContainer}>
            <SignatureCanvas
              ref={sigPad}
              penColor="black"
              canvasProps={{ width: 500, height: 200, className: 'sigCanvas' }}
            />
          </div>
          <div style={clasess.btnsContainer}>
            <GomakePrimaryButton style={clasess.clearBtn} onClick={clear}>Clear</GomakePrimaryButton>
            <GomakePrimaryButton style={clasess.saveBtn} onClick={save}>Save</GomakePrimaryButton>
          </div>

        </div>
      </GoMakeModal>
    </>
  );
};
export { ApproveSignatureModal };
