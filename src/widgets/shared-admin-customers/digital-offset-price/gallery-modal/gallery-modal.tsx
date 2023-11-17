import { GoMakeModal, GomakePrimaryButton } from "@/components";

import { useGalleryModal } from "./use-gallery-modal";
import { useStyle } from "./style";
import { useTranslation } from "react-i18next";

const GalleryModal = ({ openModal, onClose }) => {
  const { clasess } = useStyle();
  const { t } = useTranslation();
  const {
    materialData,
    selectedShape,
    createParameterForCalculation,
    onClickChoosParameter,
  } = useGalleryModal({ onClose });
  console.log("materialData", materialData);
  return (
    <>
      <GoMakeModal
        openModal={openModal}
        modalTitle={t("products.offsetPrice.admin.chooseShape", {
          name: `${materialData?.materialName}`,
        })}
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
                    style={{ width: 250, height: 210, padding: 5 }}
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
