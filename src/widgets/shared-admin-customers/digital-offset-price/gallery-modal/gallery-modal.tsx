import { GoMakeAutoComplate, GoMakeModal, GomakePrimaryButton } from "@/components";

import { useGalleryModal } from "./use-gallery-modal";
import { useStyle } from "./style";
import { useTranslation } from "react-i18next";
import { SearchInputComponent } from "@/components/form-inputs/search-input-component";
import { ReChooseIcon } from "@/icons";
import { GalleryModalMapping } from "./gallery-modal-mapping";
import { Skeleton } from "@mui/material";

const GalleryModal = ({
  openModal,
  onClose,
  onChangeSubProductsForPrice,
  isChargeForNewDie,
  setIsChargeForNewDie,
  straightKnife,
  isParameterSettings,
  getProductById,
  template,
  _renderParameterType,
  _getParameter
}: any) => {
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
    setMaterialDataFilter,
    searchResult,
    materialDataFilter,
    materialTableFilters,
    setMaterialTableFilters,
    addChargeForNewDieParameter,
    subSectionId,
    sectionId,
    value,
    isLoading,
    selectParameterButton,
    setMaterialData
  } = useGalleryModal({
    onClose,
    onChangeSubProductsForPrice,
    setIsChargeForNewDie,
    straightKnife,
    isParameterSettings,
    getProductById,
    template,
    _getParameter
  });

  return (
    <>
      <GoMakeModal
        openModal={openModal}
        modalTitle={t("products.offsetPrice.admin.chooseShape", {
          name: `${materialData?.materialName}`,
        })}
        onClose={() => {
          setMaterialTableFilters([])
          setMaterialData([])
          setMaterialDataFilter("")
          onClose()

        }}
        insideStyle={clasess.insideStyle}
        withClose={false}
      >
        <div style={clasess.firstContainer}>
          <div
            style={{ cursor: "pointer" }}
            onClick={getProductQuoteItemById}
          >
            <ReChooseIcon />
          </div>


        </div>
        <div style={clasess.bodyContainer}>
          <div style={clasess.headerContainer}>
            {materialTableFilters &&
              materialTableFilters.map(({ key, values }) => {
                return (
                  <GoMakeAutoComplate
                    key={key}
                    onChange={(e, v) => setMaterialDataFilter(v)}
                    style={{ width: "200px" }}
                    options={values}
                    placeholder={key}
                  />
                );
              })}
            <SearchInputComponent onChange={onChangeSearch} />
          </div>
          <div style={clasess.mainContainer}>
            {fixedCartData?.filter((card) => card.isShow)?.map((card, index) => {
              return (
                <div
                  style={{
                    ...clasess.fixdCard,
                    background: card.backgroundColor,
                  }}
                  onClick={card.onclick}
                  onDoubleClick={card.onDoubleClick}
                >
                  <div style={clasess.cardItemStyle}>
                    <div style={clasess.cardIconStyle}>{card.icon}</div>
                    <div style={clasess.cardNameStyle}>{card.name}</div>
                  </div>
                </div>
              );
            })}
            <>
              {isLoading && materialData?.length === 0 ? Array(11) // Adjust the number based on how many skeletons you want to show
                .fill(null)
                .map((_, index) => (
                  <Skeleton height={375} width={250} variant="rectangular"
                  />
                )) : <>
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
                        onClickChoosParameter={onClickChoosParameter}
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
                        onClickChoosParameter={onClickChoosParameter}
                      />
                    );
                  })}
              </>
              }
            </>

          </div>
        </div>
        <div style={clasess.footerContainer}>
          <div style={clasess.switchContainer}>

            {
              !isParameterSettings && addChargeForNewDieParameter && addChargeForNewDieParameter.length > 0 && selectParameterButton?.sectionId === sectionId?.section?.id && selectParameterButton?.subSectionId == subSectionId?.id && <>
                {_renderParameterType(
                  addChargeForNewDieParameter[0],
                  subSectionId,
                  sectionId?.section,
                  subSectionId?.parameters,
                  value,
                  subSectionId?.parameters,
                  true,
                  true,
                  false
                )}
              </>
            }


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
