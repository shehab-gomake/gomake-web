import { GoMakeModal, GomakePrimaryButton } from "@/components";

import { useGalleryModal } from "./use-gallery-modal";
import { useStyle } from "./style";

const GalleryModal = ({ openModal, onClose, modalTitle }) => {
  const { clasess } = useStyle();
  const {
    materialData,
    selectedShape,
    createParameterForCalculation,
    onClickChoosParameter,
  } = useGalleryModal({ onClose });

  return (
    <>
      <GoMakeModal
        openModal={openModal}
        modalTitle={modalTitle}
        onClose={onClose}
        insideStyle={clasess.insideStyle}
      >
        <div style={clasess.mainContainer}>
          {materialData?.data?.map((item, index) => {
            return (
              <div
                key={index}
                style={
                  item.id != selectedShape?.id
                    ? clasess.shapeContainer
                    : clasess.shapeSelectedContainer
                }
                onClick={() => createParameterForCalculation(item)}
              >
                <div style={{ width: "100%" }}>
                  <img
                    src={item?.rowData?.image?.value}
                    alt="shape"
                    style={{ width: "100%" }}
                  />
                </div>
                <div style={clasess.shapeNameStyle}>
                  {item?.rowData?.name?.value}
                </div>
                <div style={clasess.shapeWidthHeightStyle}>
                  {item?.rowData?.width?.value}
                </div>
                <div style={clasess.shapeWidthHeightStyle}>
                  {item?.rowData?.length?.value}
                </div>
              </div>
            );
          })}
          <div style={clasess.btnsContainer}>
            <GomakePrimaryButton style={clasess.customizeBtnStyle}>
              Customize
            </GomakePrimaryButton>
            <GomakePrimaryButton
              style={clasess.chooseBtnStyle}
              onClick={onClickChoosParameter}
            >
              Choose
            </GomakePrimaryButton>
          </div>
        </div>
      </GoMakeModal>
    </>
  );
};
export { GalleryModal };
