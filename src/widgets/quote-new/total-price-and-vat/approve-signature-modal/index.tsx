import { useTranslation } from "react-i18next";
import { GoMakeModal, GomakeTextInput } from "@/components";

import { useStyle } from "./style";
import { DateFormatterDDMMYYYY } from "@/utils/adapter";
import { useRef, useState } from "react";

const ApproveSignatureModal = ({ openModal, onClose }: any) => {
  const [selectDate, setSelectDate] = useState<any>("");
  const dateRef = useRef(null);
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
          <GomakeTextInput
            placeholder={"Enter your name"}
            style={clasess.textInputStyle}
            // value={selectedContactById?.mail}
            onChange={(e: any) => {
              console.log("DDD", e.target.value);
            }}
          />
          <div
            style={clasess.deleverdDate}
            onClick={handleClickSelectDate}
          >
            {"Select Date"}{" "}
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
          <div style={clasess.signatureContainer}></div>
        </div>
      </GoMakeModal>
    </>
  );
};
export { ApproveSignatureModal };
