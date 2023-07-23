import { useTranslation } from "react-i18next";
import { GoMakeModal, GomakePrimaryButton } from "@/components";

import { useStyle } from "./style";
import { Slider } from "@mui/material";

const MakeShapeModal = ({ openModal, onClose, modalTitle }) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  return (
    <>
      <GoMakeModal
        openModal={openModal}
        modalTitle={modalTitle}
        onClose={onClose}
        insideStyle={clasess.insideStyle}
      >
        <div>
          <div style={clasess.mainContainer}>
            <div style={clasess.shapeContainer}></div>
            <div style={clasess.adjectivesContainer}>
              <div style={clasess.adjectivesStyle}>Complexity</div>
              <div style={{ width: "100%" }}>
                <Slider defaultValue={50} aria-label="Default" />
              </div>

              <div style={clasess.adjectivesStyle}>Uniqueness</div>
              <div style={{ width: "100%" }}>
                <Slider defaultValue={50} aria-label="Default" />
              </div>
            </div>
          </div>
          <div style={clasess.btnsContainer}>
            <GomakePrimaryButton style={clasess.resetBtnStyle}>
              Reset
            </GomakePrimaryButton>

            <GomakePrimaryButton style={clasess.addBtnStyle}>
              Add shape
            </GomakePrimaryButton>
          </div>
        </div>
      </GoMakeModal>
    </>
  );
};
export { MakeShapeModal };
