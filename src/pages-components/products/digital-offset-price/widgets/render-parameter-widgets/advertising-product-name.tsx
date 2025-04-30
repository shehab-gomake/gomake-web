import { GoMakeAutoComplate, GoMakeModal, GomakePrimaryButton, GomakeTextInput } from "@/components";
import { AddNewIcon, AdvertisingIcon } from "@/icons";
import { Stack } from "@mui/material";
import { SecondaryButton } from "@/components/button/secondary-button";
import { useAdvertisingProductName } from "./use-advertising-product-name";
import { TestIcon } from "@/icons/test-icon";
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
  console.log("parameter", parameter)
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
  console.log("searchResult", searchResult)

  return (
    <div style={clasess.advertisingProductNameMain}>
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
        modalTitle={" "}
        insideStyle={{ width: 500, height: !isView ? "fit-content" : 500, padding: 20 }}
        withClose={isView ? false : true}
      >
        <>
          {isViewInfoAfterGenerate &&
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "flex-start", gap: 10 }}>
              <h3>
                {t("products.offsetPrice.admin.generatedNewDieCut!")}
              </h3>
              <div>
                <h4>
                  {newDataGenerated?.rowData?.name?.value}
                </h4>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%" }}>
                  <img src={newDataGenerated?.rowData?.image?.value} alt="newDataGenerated" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", width: "100%" }}>
                <GomakePrimaryButton
                  style={{ width: "fit-content", height: 40, minWidth: 150 }}
                  onClick={() => {
                    console.log("newDataGenerated?.rowData", newDataGenerated?.rowData)
                    onChangeSubProductsForPrice(
                      parameter?.id,
                      subSection?.id,
                      section?.id,
                      parameter?.parameterType,
                      parameter?.name,
                      parameter?.actionId,
                      { valueIds: newDataGenerated?.rowData?.name?.value, values: newDataGenerated?.rowData?.name?.value },
                      subSection?.type,
                      index,
                      parameter?.actionIndex,
                      parameter?.code,
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
                              "valueIds": [newDataGenerated?.rowData?.name?.value],
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
                    // onChangeSubProductsForPrice(
                    //   "f81d5faf-7c4b-40cd-a178-98d79d61c326",
                    //   subSection?.id,
                    //   section?.id,
                    //   4,
                    //   "Choose Die-Cut",
                    //   parameter?.actionId,
                    //   { valueIds: newDataGenerated?.rowData?.name?.value, values: newDataGenerated?.rowData?.name?.value },
                    //   subSection?.type,
                    //   index,
                    //   parameter?.actionIndex,
                    //   "DieCut",
                    // );
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
          <h3>
            {t("products.offsetPrice.admin.generateNewDieCut!")}

          </h3>
          {viewRequiredParameters(subProducts).parameterInfo.map((item: any) => {
            return <div>{item}</div>
          })}
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
    </div>
  );
};

export { AdvertisingProductNameParameterWidget };
