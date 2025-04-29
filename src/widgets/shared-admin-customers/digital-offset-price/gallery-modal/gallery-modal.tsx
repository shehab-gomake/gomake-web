import { GoMakeAutoComplate, GoMakeModal, GomakePrimaryButton } from "@/components";

import { useGalleryModal } from "./use-gallery-modal";
import { useStyle } from "./style";
import { useTranslation } from "react-i18next";
import { SearchInputComponent } from "@/components/form-inputs/search-input-component";
import { ReChooseIcon } from "@/icons";
import { GalleryModalMapping } from "./gallery-modal-mapping";
import { Skeleton } from "@mui/material";
import { useState } from "react";
import { useGomakeAxios, useSnackBar } from "@/hooks";
import { createDieCutFromTemplateMakerApi } from "@/services/api-service/materials/materials-endpoints";
import { useUserPermission } from "@/hooks/use-permission";
import { Permissions } from "@/components/CheckPermission/enum";

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
    createParameterForCalculationHidden,
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
    filteredMaterialData,
    setMaterialData,
    isDiesParameter,
    checkRequiredParameters,
    subProducts,
    setSearchResult
  } = useGalleryModal({
    onClose,
    onChangeSubProductsForPrice,
    setIsChargeForNewDie,
    straightKnife,
    isParameterSettings,
    getProductById,
    template,
    _getParameter,

  });
  const [category, setCategory] = useState<any>()
  const { callApi } = useGomakeAxios();
  const { alertFault } = useSnackBar();
  const { CheckPermission } = useUserPermission();

  const createNewTemplateEndPoint = async () => {
    const unitWidth = subProducts.flatMap((item: any) => item.parameters).find((param: any) => param.parameterCode === "DieUnitWidth")?.values[0];
    const unitLength = subProducts.flatMap((item: any) => item.parameters).find((param: any) => param.parameterCode === "DieUnitLength")?.values[0];
    const unitHeight = subProducts.flatMap((item: any) => item.parameters).find((param: any) => param.parameterCode === "DieUnitHeight")?.values[0];
    const reqObj = {
      dieCutCategory: category,
      unitWidth: Number(unitWidth),
      unitLength: Number(unitLength),
      unitHeight: Number(unitHeight),
      // sheetsCategory: category,
      // sheetsWeight: widthParameter,
      // sheetsColor: heightParameter,
    }
    const callBack = (res) => {
      if (res.success && res.data && res.data.data) {
        setSearchResult((prev: any) => {
          return [res.data.data, ...prev,] // Add the new item to the data list
        });

        const pdfUrl = res.data.pdfUrl;
        if (pdfUrl) {
          window.open(pdfUrl, '_blank');
        }
      } else {
        alertFault("error adding template")
      }
    };
    await createDieCutFromTemplateMakerApi(callApi, callBack, reqObj);
  }



  const createNewTemplate = () => {
    const result = checkRequiredParameters(subProducts);
    if (result && category) {
      createNewTemplateEndPoint()
    } else {

      const errorMessage = !result
        ? t("products.offsetPrice.admin.errorMakerTemplete1")
        : t("products.offsetPrice.admin.errorMakerTemplete2");
      alertFault(errorMessage)
    }
  }




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
          <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
            <div style={clasess.headerContainer}>
              {materialTableFilters &&
                materialTableFilters.map(({ key, values }) => {
                  return (
                    <GoMakeAutoComplate
                      key={key}
                      onChange={(e, v) => {
                        setMaterialDataFilter(v)
                        if (key === "category") {
                          setCategory(v)
                        }
                      }}
                      style={{ width: "200px" }}
                      options={values}
                      placeholder={key}
                    />
                  );
                })}
              <SearchInputComponent onChange={onChangeSearch} />
            </div>
            {
              CheckPermission(Permissions.IS_CAN_CREATE_NEW_TEMPLATE) &&
              <GomakePrimaryButton
                style={{ width: "fit-content", minWidth: "fit-content", height: "40px" }}
                onClick={createNewTemplate}
              >
                {t("products.offsetPrice.admin.createNewTemplate")}
              </GomakePrimaryButton>
            }

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
                        createParameterForCalculationHidden={
                          createParameterForCalculationHidden
                        }
                        onClickChoosParameter={onClickChoosParameter}
                        isParameterSettings={isParameterSettings}
                        template={template}
                        isDiesParameter={isDiesParameter}
                      />
                    );
                  })
                  : filteredMaterialData?.map((item, index) => {
                    return (
                      <GalleryModalMapping
                        index={index}
                        item={item}
                        selectedShape={selectedShape}
                        createParameterForCalculation={
                          createParameterForCalculation
                        }
                        createParameterForCalculationHidden={
                          createParameterForCalculationHidden
                        }
                        onClickChoosParameter={onClickChoosParameter}
                        isParameterSettings={isParameterSettings}
                        template={template}
                        isDiesParameter={isDiesParameter}
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
