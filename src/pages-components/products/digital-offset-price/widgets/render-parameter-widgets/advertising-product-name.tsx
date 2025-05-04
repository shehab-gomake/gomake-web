import { GoMakeAutoComplate, GoMakeModal, GomakePrimaryButton, GomakeTextInput } from "@/components";
import { AddNewIcon, AdvertisingIcon } from "@/icons";
import { IconButton, Stack } from "@mui/material";
import { SecondaryButton } from "@/components/button/secondary-button";
import { useAdvertisingProductName } from "./use-advertising-product-name";
import { TestIcon } from "@/icons/test-icon";
import OpenWithIcon from '@mui/icons-material/OpenWith';
import { useState } from "react";
import { SearchInput } from "@/components/containers/search-input";
import { backgroundClip } from "html2canvas/dist/types/css/property-descriptors/background-clip";
const AdvertisingProductNameParameterWidget = ({
  parameter,
  clasess,
  index,
  temp,
  onChangeSubProductsForPrice,
  subSection,
  section,
  connectionId,
  getProductById,
  getAllMaterial,
  newDieCutSelect,
}: any) => {
  const selectedDieCutType = temp.find((item: any) => item.parameterCode === "DiecutType")
  const selectedDieCutTypeValue = selectedDieCutType?.valuesConfigs?.find((item: any) => item.id === selectedDieCutType?.valueIds[0])
  const [isOpenDieCutModal, setIsOpenDieCutModal] = useState(false)
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [selectedCardData, setSelectedCardData] = useState<any>(null);
  const [searchValue, setSearchValue] = useState("");

  const {
    defaultObject,
    openModal,
    newCategory,
    setOpenModal,
    setNewCategory,
    onAddCategory,
    _renderSomeValues,
    t,
    createNewTemplate,
    searchResult,
    category,
    openGenerateModal,
    setOpenGenerateModal,
    viewRequiredParameters,
    subProducts,
    createNewTemplateEndPoint,
    isView,
    setIsRenderData,
    isViewInfoAfterGenerate,
    setIsViewInfoAfterGenerate,
    newDataGenerated,
    setSubProducts
  } = useAdvertisingProductName({ parameter, getProductById, getAllMaterial, newDieCutSelect })
  return (
    <div style={clasess.advertisingProductNameMain}>
      <div style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "flex-start", width: "100%" }}>
        <GoMakeAutoComplate
          options={
            parameter?.code === "DiecutType"
              ?
              [{ id: "new", updateName: t("products.offsetPrice.admin.creatingNewCategory") },
              ...parameter?.valuesConfigs?.filter(value => {
                return !(value?.materialValueIds?.length === 1 && value?.materialValueIds[0]?.path
                  === null && value?.materialValueIds[0]?.valueId === null);
              })?.filter((value) => !value.isHidden)?.filter((value) => value.updateName)]
              :
              parameter?.code === "DieCutter"
                ? [
                  { id: "add_new", updateName: t("products.offsetPrice.admin.addNewDieCut"), type: "add" },
                  { id: "generate_new", updateName: t("products.offsetPrice.admin.generateNewDieCut"), type: "generate" },
                  ...searchResult?.filter(value => {
                    return !(value?.materialValueIds?.length === 1 && value?.materialValueIds[0]?.path === null && value?.materialValueIds[0]?.valueId === null);
                  })?.filter((value) => !value.isHidden)?.filter((value) => value.updateName)
                ]
                : parameter?.valuesConfigs?.filter(value => {
                  return !(value?.materialValueIds?.length === 1 && value?.materialValueIds[0]?.path === null && value?.materialValueIds[0]?.valueId === null);
                })?.filter((value) => !value.isHidden)?.filter((value) => value.updateName)
          }
          key={parameter?.valuesConfigs + temp[index]?.values}
          style={parameter?.isRequired && !temp[index]?.values ? clasess.requiredAdvertisingProductCategoryAutoComplete : clasess.advertisingProductCategoryAutoComplete}
          placeholder={parameter?.name}
          onChange={(e: any, value: any) => {
            if (parameter?.code === "DiecutType") {
              setIsRenderData(true)
            }
            onChangeSubProductsForPrice(
              parameter?.id,
              subSection?.id,
              section?.id,
              parameter?.parameterType,
              parameter?.name,
              parameter?.actionId,
              { valueIds: value?.id, values: value?.updateName },
              subSection?.type,
              index,
              parameter?.actionIndex,
              parameter?.code,
              value
            );
          }}
          getOptionLabel={(option: any) => option.updateName}
          defaultValue={
            index !== -1 ? { updateName: temp[index].values } : defaultObject
          }
          disabled={parameter?.isLock ? parameter?.isLock : false}
          renderOption={(props, option) => {
            const image = option.additionalAttribute?.find(
              (attr) => attr.valueId === 'image'
            )?.value;

            // Special handling for DiecutType's first item
            if (parameter.code === "DiecutType" && option.id === "new") {
              return (
                <li {...props}
                  onClick={() => setOpenModal(true)}
                  style={{
                    backgroundColor: '#2E3092',
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start"
                  }}>
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-start"
                    }}>
                    <AddNewIcon color="white" />
                  </div>
                  {option.updateName}
                </li>
              );
            }

            // Special handling for DieCutter's new options
            if (parameter.code === "DieCutter" && (option.id === "add_new" || option.id === "generate_new")) {
              return (
                <li {...props}
                  onClick={() => {
                    if (option.id === "add_new") {
                      window.open(`/materials/${parameter?.materialPath[0]}?materialCategory=${category}&connectionID=${connectionId}`, "_blank");
                    } else {
                      createNewTemplate()
                    }
                  }}
                  style={{
                    backgroundColor: option.id === "add_new" ? '#2E3092' : '#FF69B4',
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start"
                  }}>
                  <div style={{ width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "flex-start" }}>
                    <AddNewIcon color="white" />
                  </div>
                  {option.updateName}
                </li>
              );
            }

            // Regular rendering for other items
            return (
              <li {...props}>
                {image ? (
                  <img
                    src={image}
                    alt={option.updateName}
                    style={{ width: '40px', height: '40px', margin: '10px', objectFit: 'contain' }}
                  />
                ) : (
                  <div style={{ margin: 10 }}>
                    <AdvertisingIcon width="40" height="40" />
                  </div>
                )}
                {option.updateName}
                {parameter.code != "DiecutType" && parameter.code != "DieCutter" && <span style={{ margin: 10, fontSize: 12, color: "#CCC" }}>({_renderSomeValues(option)})</span>}
              </li>
            );
          }}
        />
        {
          (parameter?.code === "DiecutType" || parameter?.code === "DieCutter") &&
          <IconButton onClick={() => setIsOpenDieCutModal(true)}>
            <OpenWithIcon style={{ color: "#2E3092" }} />
          </IconButton>
        }

      </div>


      <GoMakeModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        modalTitle={t("materials.buttons.addNew")}
        insideStyle={{ width: 400, height: "fit-content", padding: 20 }}
      >
        <Stack gap={5} justifyContent={'flex-start'} height={'100%'} width={'90%'} margin={'auto'} marginTop={"20px"}>
          <GomakeTextInput
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder={t("materials.inputs.addCategory")}
            style={{ width: '100%', height: "40px" }}
          />
          {
            <SecondaryButton
              onClick={onAddCategory}
              variant={'contained'}
              sx={{ width: '100%' }}
            >
              {t("materials.buttons.addNew")}
            </SecondaryButton>
          }
        </Stack>
      </GoMakeModal>

      <GoMakeModal
        open={openGenerateModal}
        onClose={() => isView ? null : setOpenGenerateModal(false)}
        insideStyle={{ width: 750, height: !isView ? "fit-content" : 500, padding: 20 }}
        withClose={isView ? false : true}
        modalTitle={
          isViewInfoAfterGenerate ? t("products.offsetPrice.admin.generatedNewDieCut!")
            : !isView && !isViewInfoAfterGenerate ? t("products.offsetPrice.admin.generateNewDieCut!") : ""
        }
      >
        <>
          {isViewInfoAfterGenerate &&
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "flex-start", gap: 10 }}>
              <div style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "flex-start", width: "100%", height: "100%", gap: 50 }}>

                <div style={{ width: "60%", }}>
                  <img src={newDataGenerated?.rowData?.image?.value} alt="newDataGenerated" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "flex-start", gap: 10 }}>
                  <h4>
                    Name:{newDataGenerated?.rowData?.name?.value}
                  </h4>
                  <h4>
                    {t("products.offsetPrice.admin.cuttingLineLength")}:{newDataGenerated?.rowData?.cuttingLineLength?.value}
                  </h4>
                  <h4>
                    {t("products.offsetPrice.admin.scoringLineLength")}:{newDataGenerated?.rowData?.scoringLineLength?.value}
                  </h4>
                  <h4>
                    {t("products.offsetPrice.admin.perforationLineLength")}:{newDataGenerated?.rowData?.perforationLineLength?.value}
                  </h4>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", width: "100%" }}>
                <GomakePrimaryButton
                  style={{ width: "fit-content", height: 40, minWidth: 150 }}
                  onClick={() => {
                    onChangeSubProductsForPrice(
                      parameter?.id,
                      subSection?.id,
                      section?.id,
                      parameter?.parameterType,
                      parameter?.name,
                      parameter?.actionId,
                      { valueIds: newDataGenerated?.id, values: newDataGenerated?.rowData?.name?.value },
                      subSection?.type,
                      index,
                      parameter?.actionIndex,
                      parameter?.code,
                      newDataGenerated
                    );
                    setSubProducts(prevSubProducts => {
                      return prevSubProducts.map(subProduct => {
                        return {
                          ...subProduct,
                          parameters: [
                            ...subProduct.parameters.filter(parameter => parameter.parameterCode !== "DieCut"),
                            {
                              "parameterId": "f81d5faf-7c4b-40cd-a178-98d79d61c326",
                              "parameterName": "Choose Die-Cut",
                              "actionId": null,
                              "parameterType": 4,
                              "isQuantityParameter": false,
                              "values": [newDataGenerated?.rowData?.name?.value],
                              "valueIds": [newDataGenerated?.id],
                              "sectionId": section?.id,
                              "subSectionId": subSection?.id,
                              "actionIndex": parameter?.actionIndex,
                              "parameterCode": "DieCut",
                              "valuesConfigs": [],
                              "unitKey": null,
                              "defaultUnit": null,
                              "factor": null,
                              "unitType": 0,
                              "isGeneralInfoInProductionFloor": true
                            }
                          ]
                        };
                      });
                    });

                    setIsViewInfoAfterGenerate(false)
                    setOpenGenerateModal(false)

                  }}
                >{
                    t("products.offsetPrice.admin.ok")
                  }
                </GomakePrimaryButton>
              </div>
            </div>
          }
        </>
        {!isView && !isViewInfoAfterGenerate && <Stack gap={"5px"} justifyContent={'flex-start'} margin={'auto'}>
          <div style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-start",
            width: "100%",
            height: "100%",
            gap: 50
          }}>
            {selectedDieCutTypeValue?.additionalAttribute?.find(attr => attr.valueId === 'image')?.value && <img
              src={selectedDieCutTypeValue?.additionalAttribute?.find(attr => attr.valueId === 'image')?.value}
              alt="parameter"
              style={{ width: 280, height: 280, objectFit: "contain" }}
            />
            }
            <div style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              justifyContent: "flex-start",
              marginTop: 22,
              gap: 20
            }}>
              {viewRequiredParameters(subProducts).parameterInfo.map((item: any) => {
                return <div>{item}</div>
              })}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <h4>{t("products.offsetPrice.admin.numberCanBeGenerated")}: 12</h4>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
              <GomakePrimaryButton sx={{ width: "fit-content", height: 40 }} onClick={createNewTemplateEndPoint}>{t("products.offsetPrice.admin.generate")}</GomakePrimaryButton>
            </div>
          </div>

        </Stack>}
        {isView && !isViewInfoAfterGenerate && <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "rgba(0, 0, 0, 0.3)",
          borderRadius: 14,
        }}>
          <TestIcon />
        </div>}
      </GoMakeModal>

      <GoMakeModal
        open={isOpenDieCutModal}
        onClose={() => {
          setIsOpenDieCutModal(false)
          setSelectedCardId(null)
          setSelectedCardData(null)
        }}
        insideStyle={{ width: 850, height: "fit-content", padding: 20 }}
        modalTitle={parameter?.name}
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "flex-start", gap: 10, marginTop: 25, }}>
          <div style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "100%", height: "100%", }}>
            <div>
              <SearchInput
                name={'side-list-search'}
                placeholder={t('header.search')}
                onChange={e => setSearchValue(e.target.value)}
                value={searchValue}
              />
            </div>
            <div>
              {
                parameter?.code === "DieCutter" &&
                <>
                  <GomakePrimaryButton
                    sx={{ width: "fit-content", height: 40, marginRight: "10px" }}
                    onClick={() => {
                      window.open(`/materials/${parameter?.materialPath[0]}?materialCategory=${category}&connectionID=${connectionId}`, "_blank");
                    }}
                  >{t("products.offsetPrice.admin.addNewDieCut")}
                  </GomakePrimaryButton>
                  <GomakePrimaryButton
                    style={{ width: "fit-content", height: 40, background: "#FF69B4" }}
                    onClick={createNewTemplate}>
                    {t("products.offsetPrice.admin.generateNewDieCut")}
                  </GomakePrimaryButton>
                </>

              }
              {
                parameter?.code === "DiecutType" &&
                <GomakePrimaryButton sx={{ width: "fit-content", height: 40 }} onClick={() => {
                  setOpenModal(true)
                  setIsOpenDieCutModal(false)
                }}>{t("products.offsetPrice.admin.creatingNewCategory")}</GomakePrimaryButton>
              }
            </div>

          </div>
          <div style={{ overflow: "scroll", maxHeight: 800 }}>
            {(parameter?.code === "DiecutType" || parameter?.code === "DieCutter") &&
              <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
                {parameter?.valuesConfigs?.filter(value => {
                  return !(value?.materialValueIds?.length === 1 && value?.materialValueIds[0]?.path
                    === null && value?.materialValueIds[0]?.valueId === null);
                })?.filter((value) => !value.isHidden)?.filter((value) => value.updateName)?.filter((value) => value.updateName.toLowerCase().includes(searchValue.toLowerCase()))?.map((item: any) => {
                  const image = item.additionalAttribute?.find(attr => attr.valueId === 'image')?.value;
                  const name = item.updateName || item.additionalAttribute?.find(attr => attr.valueId === 'name')?.value;
                  const isSelected = selectedCardId === item.id;
                  return (
                    <div
                      key={item.id}
                      style={{
                        border: isSelected ? "2px solid #2E3092" : "1px solid #e0e0e0",
                        borderRadius: 8,
                        padding: 12,
                        width: 220,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                        background: "#fff",
                        cursor: "pointer",
                        transition: "border 0.2s"
                      }}
                      onClick={() => {
                        setSelectedCardId(item.id);
                        setSelectedCardData(item);
                      }}
                      onDoubleClick={() => {
                        setIsRenderData(true);
                        onChangeSubProductsForPrice(
                          parameter?.id,
                          subSection?.id,
                          section?.id,
                          parameter?.parameterType,
                          parameter?.name,
                          parameter?.actionId,
                          { valueIds: item.id, values: name },
                          subSection?.type,
                          index,
                          parameter?.actionIndex,
                          parameter?.code,
                          item
                        );
                        setIsOpenDieCutModal(false);
                      }}
                    >
                      {(
                        <img
                          src={image}
                          alt={name}
                          style={{ width: 200, height: 200, objectFit: "contain", marginBottom: 8 }}
                        />
                      )}
                      <div style={{ fontWeight: 500, textAlign: "center" }}>{name}</div>
                    </div>
                  );
                })}
              </div>

            }
          </div>
          {<div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", width: "100%" }}>
            <GomakePrimaryButton sx={{ minWidth: 150, width: "fit-content", height: 40 }} onClick={() => {
              if (selectedCardId && selectedCardData) {
                setIsRenderData(true);
                onChangeSubProductsForPrice(
                  parameter?.id,
                  subSection?.id,
                  section?.id,
                  parameter?.parameterType,
                  parameter?.name,
                  parameter?.actionId,
                  { valueIds: selectedCardId, values: selectedCardData.updateName || selectedCardData.additionalAttribute?.find(attr => attr.valueId === 'name')?.value },
                  subSection?.type,
                  index,
                  parameter?.actionIndex,
                  parameter?.code,
                  selectedCardData
                );
              }
              setIsOpenDieCutModal(false);
            }}>{t("pricingWidget.selecte")}</GomakePrimaryButton>
          </div>}
        </div>
      </GoMakeModal>
    </div>
  );
};

export { AdvertisingProductNameParameterWidget };
