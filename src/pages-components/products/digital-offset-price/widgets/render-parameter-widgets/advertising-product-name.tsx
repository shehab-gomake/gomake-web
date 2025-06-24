import { GoMakeAutoComplate, GoMakeModal, GomakePrimaryButton, GomakeTextInput } from "@/components";
import { AddNewIcon, AdvertisingIcon } from "@/icons";
import { IconButton, Stack, Tooltip } from "@mui/material";
import { SecondaryButton } from "@/components/button/secondary-button";
import { useAdvertisingProductName } from "./use-advertising-product-name";
import { TestIcon } from "@/icons/test-icon";
import OpenWithIcon from '@mui/icons-material/OpenWith';
import { SearchInput } from "@/components/containers/search-input";
import { EParameterTypes } from "@/enums";
import { useCallback, useEffect } from "react";
import { useState } from "react";
import { PdfIcon } from "@/components/icons/pdf-icon";
import { DfxIcon } from "@/components/icons/dfx-icon";
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
    setLastOption,
    isOpenDieCutModal,
    setIsOpenDieCutModal,
    selectedCardId,
    selectedCardData,
    searchValue,
    setSearchValue,
    selectedDieCutTypeValue,
    setSelectedCardId,
    setSelectedCardData,
    pdfUrl,
    setPdfUrl,
    dxfUrl,
    setDxfUrl
  } = useAdvertisingProductName({ parameter, getProductById, getAllMaterial, newDieCutSelect, temp })
  const categoryImage = selectedDieCutTypeValue?.additionalAttribute?.find(attr => attr.valueId === 'categoryImage')?.value;
  const image = selectedDieCutTypeValue?.additionalAttribute?.find(attr => attr.valueId === 'image')?.value;
  const unit = subProducts.flatMap((item: any) => item.parameters).find((param: any) => param.parameterCode === "DieUnitWidth")?.unitKey;

  const DieCutTypeOptions = [
    { id: "new", updateName: t("products.offsetPrice.admin.creatingNewCategory"), isStatic: true },
    ...parameter?.valuesConfigs?.filter(value => {
      return !(value?.materialValueIds?.length === 1 && value?.materialValueIds[0]?.path
        === null && value?.materialValueIds[0]?.valueId === null);
    })?.filter((value) => !value.isHidden)?.filter((value) => value.updateName)
  ]

  const options = parameter?.valuesConfigs?.filter(value => {
    return !(value?.materialValueIds?.length === 1 && value?.materialValueIds[0]?.path === null && value?.materialValueIds[0]?.valueId === null);
  })?.filter((value) => !value.isHidden)?.filter((value) => value.updateName)

  const DieCutterOptions = [
    { id: "add_new", updateName: t("products.offsetPrice.admin.addNewDieCut"), type: "add", isStatic: true },
    { id: "generate_new", updateName: t("products.offsetPrice.admin.generateNewDieCut"), type: "generate", isStatic: true },
    ...searchResult?.filter(value => {
      return !(value?.materialValueIds?.length === 1 && value?.materialValueIds[0]?.path === null && value?.materialValueIds[0]?.valueId === null);
    })?.filter((value) => !value.isHidden)?.filter((value) => value.updateName)
  ]


  const getOptions = useCallback(() => {
    const MyOptions = parameter?.code === "DiecutType"
      ? DieCutTypeOptions
      : parameter?.code === "DieCutter"
        ? DieCutterOptions
        : options;

    // Add validation check
    if (!MyOptions || !Array.isArray(MyOptions)) {
      console.warn(`Invalid options for parameter code: ${parameter?.code}`);
      return [];
    }

    return MyOptions;
  }, [parameter?.code, DieCutTypeOptions, DieCutterOptions, options]);

  console.log("getOptions", getOptions())

  const [selectedValue, setSelectedValue] = useState(
    index !== -1
      ? { updateName: temp[index].values }
      : parameter.valuesConfigs.find((item) => item.isDefault)
  );

  useEffect(() => {
    setSelectedValue(
      (index !== -1 && temp[index]?.values) ? { updateName: temp[index].values } : undefined
    );
  }, [parameter, index,]);

  return (
    <div style={clasess.advertisingProductNameMain}>
      <div style={clasess.advertisingProductNameAutoComplete}>
        <GoMakeAutoComplate
          options={getOptions()}
          key={
            parameter?.parameterType === EParameterTypes.MACHINES_SELECT ?
              selectedValue :
              index !== -1 && temp[index]?.values ? selectedValue
                : undefined}
          style={parameter?.isRequired && !temp[index]?.values ? clasess.requiredAdvertisingProductCategoryAutoComplete : clasess.advertisingProductCategoryAutoComplete}
          placeholder={parameter?.name}
          onChange={(e: any, value: any) => {
            if (parameter?.code === "DiecutType") {
              setIsRenderData(true)
              setLastOption({})
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
          disabled={parameter?.isLock ? parameter?.isLock : false}
          value={selectedValue} // Controlled value, reflecting the current state
          renderOption={(props, option) => {
            const image = option.additionalAttribute?.find(
              (attr) => attr.valueId === 'image'
            )?.value;
            const categoryImage = option.additionalAttribute?.find(
              (attr) => attr.valueId === 'categoryImage'
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
                {(image || categoryImage) ? (
                  <img
                    src={parameter?.code === "DiecutType" ? categoryImage : image}
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
        insideStyle={clasess.modalStyle}
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
            <div style={clasess.modalContent}>
              <div style={clasess.modalContentImage}>

                <div style={clasess.modalContentImageItem}>
                  <img src={newDataGenerated?.rowData?.image?.value} alt="newDataGenerated" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                </div>
                <div style={clasess.modalContentDataItem}>
                  <h4>
                    Name:{newDataGenerated?.rowData?.name?.value}
                  </h4>
                  <h4>
                    {t("products.offsetPrice.admin.cuttingLineLength")}:{newDataGenerated?.rowData?.cuttingLineLength?.value} {unit}
                  </h4>
                  <h4>
                    {t("products.offsetPrice.admin.scoringLineLength")}:{newDataGenerated?.rowData?.scoringLineLength?.value} {unit}
                  </h4>
                  <h4>
                    {t("products.offsetPrice.admin.perforationLineLength")}:{newDataGenerated?.rowData?.perforationLineLength?.value} {unit}
                  </h4>
                </div>
              </div>
              <div style={clasess.modalContentButton}>
                <div style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "flex-end", gap: 10 }}>
                  {pdfUrl && <GomakePrimaryButton sx={{ width: "fit-content", height: 40 }} onClick={() => {
                    window.open(pdfUrl, '_blank');
                  }}>{t("products.offsetPrice.admin.viewPdf")}</GomakePrimaryButton>}
                  {dxfUrl && <GomakePrimaryButton sx={{ width: "fit-content", height: 40 }} onClick={() => {
                    window.open(dxfUrl, '_blank');
                  }}>{t("products.offsetPrice.admin.viewDfx")}</GomakePrimaryButton>}
                </div>

                <GomakePrimaryButton
                  style={clasess.modalContentButtonItem}
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
                    setIsViewInfoAfterGenerate(false)
                    setOpenGenerateModal(false)
                    setPdfUrl(null)
                    setDxfUrl(null)
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
          <div style={clasess.modalContentImage}>
            {(image || categoryImage) && <img
              src={categoryImage != "" ? categoryImage : image}
              alt="parameter image"
              style={clasess.modalContentImageItem2}
            />
            }
            <div style={clasess.modalContentDataItem2}>
              {viewRequiredParameters(subProducts).parameterInfo.map((item: any) => {
                return <div>{item}</div>
              })}
            </div>
          </div>
          <div style={clasess.modalContentButton2}>
            <h4>{t("products.offsetPrice.admin.numberCanBeGenerated")}: 12</h4>
            <div style={clasess.modalContentButtonItem2}>
              <GomakePrimaryButton sx={{ width: "fit-content", height: 40 }} onClick={createNewTemplateEndPoint}>{t("products.offsetPrice.admin.generate")}</GomakePrimaryButton>
            </div>
          </div>

        </Stack>}
        {isView && !isViewInfoAfterGenerate && <div style={clasess.modalContentIcon}>
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
        insideStyle={{ width: 1000, height: "fit-content", padding: 20 }}
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
                <div style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "flex-end", gap: 15 }}>
                  <GomakePrimaryButton
                    sx={{ width: "fit-content", height: 40, }}
                    onClick={() => {
                      window.open(`/materials/${parameter?.materialPath[0]}?materialCategory=${category}&connectionID=${connectionId}`, "_blank");
                    }}
                  >{t("products.offsetPrice.admin.addNewDieCut")}
                  </GomakePrimaryButton>
                  <GomakePrimaryButton
                    style={{ width: "fit-content", height: 40, background: "#FF69B4" }}
                    onClick={() => {
                      createNewTemplate()
                      setIsOpenDieCutModal(false)
                    }}>
                    {t("products.offsetPrice.admin.generateNewDieCut")}
                  </GomakePrimaryButton>
                </div>

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
          <div style={{ overflow: "scroll", maxHeight: 500 }}>
            {(parameter?.code === "DiecutType" || parameter?.code === "DieCutter") &&
              <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
                {getOptions()?.filter(option => !option.isStatic)?.filter((value) => value.updateName.toLowerCase().includes(searchValue.toLowerCase()))?.map((item: any) => {
                  const categoryImage = item.additionalAttribute?.find(attr => attr.valueId === 'categoryImage')?.value;
                  const image = item.additionalAttribute?.find(attr => attr.valueId === 'image')?.value;
                  const name = item.updateName || item.additionalAttribute?.find(attr => attr.valueId === 'name')?.value;
                  const isSelected = selectedCardId === item.id;
                  const pdfUrlValue = item.additionalAttribute?.find(attr => attr.valueId === 'pdfUrl')?.value;
                  const dfxUrlValue = item.additionalAttribute?.find(attr => attr.valueId === 'dfxUrl')?.value;
                  return (
                    <div
                      key={item.id}
                      style={{
                        border: isSelected ? "2px solid #2E3092" : "1px solid #e0e0e0",
                        borderRadius: 8,
                        padding: 12,
                        width: 220,
                        height: 220,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                        background: "#fff",
                        cursor: "pointer",
                        transition: "border 0.2s",
                        position: "relative"
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
                      {
                        pdfUrlValue &&
                        <div onClick={() => {
                          window.open(pdfUrlValue, '_blank');
                        }}
                          style={{ position: "absolute", top: 5, right: 5, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
                          <Tooltip title={t("products.offsetPrice.admin.viewPdf")}>
                            <IconButton>
                              <PdfIcon />
                            </IconButton>
                          </Tooltip>
                        </div>
                      }
                      {
                        dfxUrlValue &&
                        <div onClick={() => {
                          window.open(dfxUrlValue, '_blank');
                        }}
                          style={{ position: "absolute", top: 5, right: 30, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
                          <Tooltip title={t("products.offsetPrice.admin.viewDfx")}>
                            <IconButton>
                              <DfxIcon />
                            </IconButton>
                          </Tooltip>
                        </div>
                      }
                      {(
                        <img
                          src={parameter?.code === "DiecutType" ? categoryImage : image}
                          alt={name}
                          style={{ width: 150, height: 150, objectFit: "contain", marginBottom: 8 }}
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
                  { valueIds: selectedCardData?.id, values: selectedCardData.updateName || selectedCardData.additionalAttribute?.find(attr => attr.valueId === 'name')?.value },
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
