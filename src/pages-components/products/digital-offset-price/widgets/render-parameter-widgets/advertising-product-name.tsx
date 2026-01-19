import { GoMakeAutoComplate, GoMakeModal, GomakePrimaryButton, GomakeTextInput } from "@/components";
import { AddNewIcon, AdvertisingIcon, WarnIcon, WarningModalIcon } from "@/icons";
import { IconButton, Stack, Tooltip, Paper, Divider, Popper, styled } from "@mui/material";
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
  productTemplate,
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
    setDxfUrl,
    openCustomModal,
    setOpenCustomModal,
    customDimensions,
    setCustomDimensions,
    createNewTemplateWithCustomDimensions,
    openErrorModal,
    setOpenErrorModal,
    errorMessage,
    resetModalStates,
    getDynamicParameters,
    initializeCustomDimensions
  } = useAdvertisingProductName({ parameter, getProductById, getAllMaterial, newDieCutSelect, temp, productTemplate })
  const categoryImage = selectedDieCutTypeValue?.additionalAttribute?.find(attr => attr.valueId === 'categoryImage')?.value;
  const image = selectedDieCutTypeValue?.additionalAttribute?.find(attr => attr.valueId === 'image')?.value;
  // Get unit from subProducts first, then fallback to productTemplate
  const unitFromSubProducts = subProducts.flatMap((item: any) => item.parameters).find((param: any) => param.parameterCode === "Width" || param.parameterCode === "Height")?.defaultUnit;
  const getUnitFromTemplate = () => {
    if (unitFromSubProducts) return unitFromSubProducts;

    // Search in productTemplate if not found in subProducts using existing helper function
    const widthParamFromTemplate = productTemplate?.sections?.flatMap(section =>
      section.subSections?.flatMap(subSection =>
        subSection.parameters?.filter(param => param.code === "Width" || param.code === "Height")
      )
    ).find(param => param?.unitKey);
    return widthParamFromTemplate?.defaultUnit;
  };


  const unit = getUnitFromTemplate();



  // Regular options (scrollable)
  const regularDieCutTypeOptions = parameter?.valuesConfigs?.filter(value => {
    return !(value?.materialValueIds?.length === 1 && value?.materialValueIds[0]?.path
      === null && value?.materialValueIds[0]?.valueId === null);
  })?.filter((value) => !value.isHidden)?.filter((value) => value.updateName) || [];

  const regularDieCutterOptions = searchResult?.filter(value => {
    return !(value?.materialValueIds?.length === 1 && value?.materialValueIds[0]?.path === null && value?.materialValueIds[0]?.valueId === null);
  })?.filter((value) => !value.isHidden)?.filter((value) => value.updateName) || [];

  // Fixed bottom options
  const fixedDieCutTypeOptions = [
    { id: "new", updateName: t("products.offsetPrice.admin.creatingNewCategory"), isStatic: true, isFixed: true }
  ];

  const fixedDieCutterOptions = [
    { id: "add_new", updateName: t("products.offsetPrice.admin.addNewDieCut"), type: "add", isStatic: true, isFixed: true },
    { id: "generate_new", updateName: t("products.offsetPrice.admin.generateNewDieCut"), type: "generate", isStatic: true, isFixed: true }
  ];

  // Combined options (for backward compatibility with existing logic)
  const DieCutTypeOptions = [...regularDieCutTypeOptions, ...fixedDieCutTypeOptions];

  const options = parameter?.valuesConfigs?.filter(value => {
    return !(value?.materialValueIds?.length === 1 && value?.materialValueIds[0]?.path === null && value?.materialValueIds[0]?.valueId === null);
  })?.filter((value) => !value.isHidden)?.filter((value) => value.updateName)

  const DieCutterOptions = [...regularDieCutterOptions, ...fixedDieCutterOptions];


  // Custom PaperComponent with fixed bottom options
  const CustomPaperComponent = (props: any) => {
    const fixedOptions = parameter?.code === "DiecutType"
      ? fixedDieCutTypeOptions
      : parameter?.code === "DieCutter"
        ? fixedDieCutterOptions
        : [];



    return (
      <Paper {...props} style={{ ...props.style, display: 'flex', flexDirection: 'column', maxHeight: '300px' }}>
        {/* Scrollable content */}
        <div style={{ flex: 1, overflowY: 'auto', maxHeight: '240px' }}>
          {props.children}
        </div>

        {/* Fixed bottom options */}
        {fixedOptions.length > 0 && (
          <>
            <Divider />
            <div style={{ backgroundColor: '#f5f5f5', padding: '4px 0' }}>
              {fixedOptions.map((option) => (
                <Tooltip key={option.id} title={option.updateName} placement="top">
                  <div
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();

                      if (parameter.code === "DiecutType" && option.id === "new") {
                        setOpenModal(true);
                      } else if (parameter.code === "DieCutter") {
                        if (option.id === "add_new") {
                          window.open(`/materials/${parameter?.materialPath[0]}?materialCategory=${category}&connectionID=${connectionId}`, "_blank");
                        } else if (option.id === "generate_new") {
                          createNewTemplate();
                        }
                      }

                      // Close the dropdown after action
                      const backdrop = document.querySelector('.MuiAutocomplete-popper');
                      if (backdrop) {
                        const closeEvent = new KeyboardEvent('keydown', { key: 'Escape' });
                        document.dispatchEvent(closeEvent);
                      }
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    style={{
                      backgroundColor: option.id === "add_new" ? 'var(--theme-primary-color, #2E3092)' : option.id === "generate_new" ? '#FF69B4' : 'var(--theme-primary-color, #2E3092)',
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-start",
                      padding: "4px 8px",
                      cursor: "pointer",
                      borderRadius: "4px",
                      height: "40px",
                      margin: "4px 8px",
                    }}
                  >
                    <div style={{ width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "flex-start" }}>
                      <AddNewIcon color="white" />
                    </div>
                    <div style={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      flex: 1
                    }}>
                      {option.updateName}
                    </div>
                  </div>
                </Tooltip>
              ))}
            </div>
          </>
        )}
      </Paper>
    );
  };

  const getOptions = useCallback(() => {
    // Return only regular (scrollable) options, excluding fixed bottom options
    const MyOptions = parameter?.code === "DiecutType"
      ? regularDieCutTypeOptions
      : parameter?.code === "DieCutter"
        ? regularDieCutterOptions
        : options;

    // Add validation check
    if (!MyOptions || !Array.isArray(MyOptions)) {
      console.warn(`Invalid options for parameter code: ${parameter?.code}`);
      return [];
    }

    return MyOptions;
  }, [parameter?.code, regularDieCutTypeOptions, regularDieCutterOptions, options]);


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

  const StyledPopper = styled(Popper)(({ theme }) => ({
    // zIndex: 10000000, // Higher than modal z-index (9999999)
    "&[data-popper-placement]": {
      width: "150%",
    },
    "& .MuiAutocomplete-paper": {
      width: "150%",
      minWidth: "150%",
    },
    "& .MuiAutocomplete-listbox": {
      width: "150%",
    },
  }));
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
          PaperComponent={CustomPaperComponent}
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
          PopperComponent={StyledPopper}
          disablePortal={false}
          renderOption={(props, option) => {
            const image = option.additionalAttribute?.find(
              (attr) => attr.valueId === 'image'
            )?.value;
            const categoryImage = option.additionalAttribute?.find(
              (attr) => attr.valueId === 'categoryImage'
            )?.value;

            // Regular rendering for all items (fixed options are now handled in CustomPaperComponent)
            return (
              <li {...props}>
                {
                  parameter?.code === "Rolldirection" &&
                  <img
                    src={option?.imageUrl}
                    alt={option.updateName}
                    style={{ width: '60px', height: '70px', margin: '10px', objectFit: "fill" }}
                  />
                }
                {
                  parameter?.code != "Rolldirection" && <>
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
                  </>
                }
                {option.updateName}
                {parameter.code != "DiecutType" && parameter.code != "DieCutter" && parameter.code != "Rolldirection" && <span style={{ margin: 10, fontSize: 12, color: "#CCC" }}>({_renderSomeValues(option)})</span>}
              </li>
            );
          }}

        />
        {
          (parameter?.code === "DiecutType" || parameter?.code === "DieCutter") &&
          <IconButton onClick={() => setIsOpenDieCutModal(true)}>
            <OpenWithIcon style={{ color: "var(--theme-secondary-color, #2E3092)" }} />
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
        onClose={() => {
          if (!isView) {
            setOpenGenerateModal(false);
            // Reset all modal states when closing
            resetModalStates();
          }
        }}
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
                  <img src={newDataGenerated?.rowData?.image?.value} alt="newDataGenerated" style={{ width: "100%", height: "100%", objectFit: "contain", maxHeight: "400px" }} />
                </div>
                <div style={clasess.modalContentDataItem}>
                  <h4>
                    {t("sales.quote.name")}: {newDataGenerated?.rowData?.name?.value}
                  </h4>
                  <h4>
                    {t("products.offsetPrice.admin.cuttingLineLength")}: {newDataGenerated?.rowData?.cuttingLineLength?.value} {unit}
                  </h4>
                  <h4>
                    {t("products.offsetPrice.admin.scoringLineLength")}: {newDataGenerated?.rowData?.scoringLineLength?.value} {unit}
                  </h4>
                  <h4>
                    {t("products.offsetPrice.admin.perforationLineLength")}: {newDataGenerated?.rowData?.perforationLineLength?.value} {unit}
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
          {/* Show dynamic dimension inputs based on category */}
          {(() => {
            const dynamicParams = getDynamicParameters();
            const hasDynamicParams = dynamicParams.length > 0;

            if (hasDynamicParams) {
              // Check if all required fields are filled
              const requiredParams = dynamicParams.filter((param: any) => param.isRequired !== false);
              const allFieldsFilled = requiredParams.length === 0 || requiredParams.every((param: any) => {
                const value = customDimensions[param.code];
                return value !== undefined && value !== "" && value !== null;
              });

              return (
                <>
                  <div style={clasess.modalContentImage}>
                    {(image || categoryImage) && <img
                      src={categoryImage != "" ? categoryImage : image}
                      alt="parameter image"
                      style={clasess.modalContentImageItem2}
                    />
                    }
                    <div
                      className="custom-scrollbar"
                      style={{
                        ...clasess.modalContentDataItem2,
                        maxHeight: "380px",
                        overflowY: "auto",
                        overflowX: "hidden",
                        paddingRight: "8px",
                      }}>
                      {dynamicParams.map((param: any) => {
                        const paramValue = customDimensions[param.code] || "";
                        const paramUnit = param.defaultUnit || unit;
                        const isRequired = param.isRequired !== false;

                        return (
                          <div key={param.code} style={{ marginBottom: 15 }}>
                            <div style={{ marginBottom: 8, fontWeight: 500, fontSize: 14 }}>
                              {param.name || param.code} {paramUnit && <small>{paramUnit}</small>}
                              {isRequired && <span style={{ color: 'red' }}> *</span>}
                            </div>
                            <GomakeTextInput
                              value={paramValue}
                              onChange={(e) => setCustomDimensions((prev: any) => ({ ...prev, [param.code]: e.target.value }))}
                              placeholder={param.name || param.code}
                              style={{ width: '100%', height: "35px", minWidth: "200px" }}
                              type="number"
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div style={clasess.modalContentButton2}>
                    <h4>{t("products.offsetPrice.admin.numberCanBeGenerated")}: 12</h4>
                    <div style={clasess.modalContentButtonItem2}>
                      <GomakePrimaryButton
                        sx={{
                          width: "fit-content",
                          height: 40,
                          backgroundColor: !allFieldsFilled ? "#ccc" : "var(--theme-primary-color, #2E3092)"
                        }}
                        disabled={!allFieldsFilled}
                        onClick={createNewTemplateWithCustomDimensions}
                      >
                        {t("products.offsetPrice.admin.generate")}
                      </GomakePrimaryButton>
                    </div>
                  </div>
                </>
              );
            } else {
              // Fallback to normal view if no dynamic parameters found
              return (
                <>
                  <div style={clasess.modalContentImage}>
                    {(image || categoryImage) && <img
                      src={categoryImage != "" ? categoryImage : image}
                      alt="parameter image"
                      style={clasess.modalContentImageItem2}
                    />
                    }
                    <div style={clasess.modalContentDataItem2}>
                      {viewRequiredParameters(subProducts).parameterInfo.map((item: any, index: number) => {
                        return <div key={index}>{item}</div>
                      })}
                    </div>
                  </div>
                  <div style={clasess.modalContentButton2}>
                    <h4>{t("products.offsetPrice.admin.numberCanBeGenerated")}: 12</h4>
                    <div style={clasess.modalContentButtonItem2}>
                      <GomakePrimaryButton sx={{ width: "fit-content", height: 40 }} onClick={createNewTemplateEndPoint}>{t("products.offsetPrice.admin.generate")}</GomakePrimaryButton>
                    </div>
                  </div>
                </>
              );
            }
          })()}
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
                        border: isSelected ? "2px solid var(--theme-primary-color, #2E3092)" : "1px solid #e0e0e0",
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


      {/* Warning/Message Modal */}
      <GoMakeModal
        open={openErrorModal}
        onClose={() => setOpenErrorModal(false)}
        insideStyle={{ width: 450, height: "fit-content", padding: 25 }}
        modalTitle={t(" ")}
        withClose={false}
      >
        <Stack gap={3} justifyContent={'center'} alignItems={'center'} margin={'auto'} marginTop={"20px"}>
          <WarningModalIcon color={"#F59E0B"} />
          <div style={{
            textAlign: "center",
            fontSize: 16,
            fontWeight: 600,
            lineHeight: 1.5,
            color: "#374151",
          }}>
            {errorMessage}
          </div>

          <GomakePrimaryButton
            onClick={() => setOpenErrorModal(false)}
            sx={{
              width: 'fit-content',
              minWidth: 120,
              height: 40,
              background: "#F59E0B",
              display: "flex",

              '&:hover': {
                background: "#F59E0B"
              }
            }}
          >
            {t("modal.ok")}
          </GomakePrimaryButton>
        </Stack>
      </GoMakeModal>
    </div>
  );
};

export { AdvertisingProductNameParameterWidget };
