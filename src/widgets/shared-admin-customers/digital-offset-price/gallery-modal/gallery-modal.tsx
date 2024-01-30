import { GoMakeModal, GomakePrimaryButton, SecondSwitch } from "@/components";

import { useGalleryModal } from "./use-gallery-modal";
import { useStyle } from "./style";
import { useTranslation } from "react-i18next";
import { SearchInputComponent } from "@/components/form-inputs/search-input-component";
import { RechooseIcon } from "@/icons";
import { GalleryModalMapping } from "./gallery-modal-mapping";

const GalleryModal = ({ openModal, onClose, onChangeSubProductsForPrice, isChargeForNewDie, setIsChargeForNewDie, straightKnife }) => {
  const { clasess } = useStyle();
  const { t } = useTranslation();
  const {
    materialData,
    selectedShape,
    fixedCartData,
    createParameterForCalculation,
    onClickChoosParameter,
    getProductQuoteItemById,
    onChangeSearch,
    searchResult,
    materialDataFilter,
  } = useGalleryModal({ onClose, onChangeSubProductsForPrice, setIsChargeForNewDie, straightKnife });
  return (
    <>
      <GoMakeModal
        openModal={openModal}
        modalTitle={t("products.offsetPrice.admin.chooseShape", {
          name: `${materialData?.materialName}`,
        })}
        onClose={onClose}
        insideStyle={clasess.insideStyle}
        withClose={false}
      >
        <div style={clasess.firstContainer}>
          <div style={clasess.headerContainer}>
            <SearchInputComponent onChange={onChangeSearch} />
            <div
              style={{ cursor: "pointer" }}
              onClick={getProductQuoteItemById}
            >
              <RechooseIcon />
            </div>
          </div>
        </div>
        <div style={clasess.bodyContainer}>
          <div style={clasess.mainContainer}>
            {fixedCartData?.map((card, index) => {
              return (
                <div
                  style={{
                    ...clasess.fixdCard,
                    background: card.backgroundColor,
                  }}
                  onClick={card.onclick}
                >
                  <div style={clasess.cardItemStyle}>
                    <div style={clasess.cardIconStyle}>{card.icon}</div>
                    <div style={clasess.cardNameStyle}>{card.name}</div>
                  </div>
                </div>
              );
            })}

            {materialDataFilter
              ? searchResult?.map((item, index) => {
                return (
                  <GalleryModalMapping
                    index={index}
                    item={item}
                    selectedShape={selectedShape}
                    createParameterForCalculation={
                      createParameterForCalculation
                    }
                  />
                );
              })
              : materialData?.data?.map((item, index) => {
                return (
                  <GalleryModalMapping
                    index={index}
                    item={item}
                    selectedShape={selectedShape}
                    createParameterForCalculation={
                      createParameterForCalculation
                    }
                  />
                );
              })}
          </div>
        </div>
        <div style={clasess.footerContainer}>
          <div style={clasess.switchContainer}>
            <SecondSwitch

              checked={isChargeForNewDie}
              onChange={() => {
                setIsChargeForNewDie(
                  !isChargeForNewDie
                );
              }}
            />
            <div style={isChargeForNewDie ? clasess.switchlabelSelected : clasess.switchlabel}>Add a charge for new Die</div>
          </div>
          <GomakePrimaryButton
            style={clasess.chooseBtnStyle}
            onClick={onClickChoosParameter}
          >
            {t("sales.quote.save")}
          </GomakePrimaryButton>
          <div />
        </div>
      </GoMakeModal>
    </>
  );
};
export { GalleryModal };
