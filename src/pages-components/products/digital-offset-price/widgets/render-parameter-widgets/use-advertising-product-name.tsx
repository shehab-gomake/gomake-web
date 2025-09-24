import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { useTranslation } from "react-i18next";

import { useGomakeAxios, useSnackBar } from "@/hooks";
import { lastOptionState, subProductsParametersState } from "@/store/general-parameters-state";
import { addPrintHouseMaterialCategoryApi } from "@/services/api-service/materials/printhouse-materials-endpoints";
import { createDieCutFromTemplateMakerApi, getMaterialCategoryByMaterialKeyApi } from "@/services/api-service/materials/materials-endpoints";

const useAdvertisingProductName = ({ parameter, getProductById, getAllMaterial, newDieCutSelect, temp, productTemplate }) => {
  const { t } = useTranslation();
  const { callApi } = useGomakeAxios();
  const { alertSuccessAdded, alertFaultAdded, alertFault } = useSnackBar();
  const [subProducts, setSubProducts] = useRecoilState<any>(subProductsParametersState);
  const category = subProducts.flatMap((item: any) => item.parameters).find((param: any) => param.parameterCode === "DiecutType")?.valueIds[0];
  const [openGenerateModal, setOpenGenerateModal] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [searchResult, setSearchResult] = useState(parameter?.valuesConfigs);
  const [lastOption, setLastOption] = useRecoilState(lastOptionState)
  const selectedDieCutType = temp.find((item: any) => item.parameterCode === "DiecutType")
  const selectedDieCutter = temp.find((item: any) => item.parameterCode === "DieCutter")
  const selectedDieCutTypeValue = selectedDieCutType?.valuesConfigs?.find((item: any) => item.id === selectedDieCutType?.valueIds[0])
  const selectedDieCutterValue = selectedDieCutter?.valuesConfigs?.find((item: any) => item.id === selectedDieCutter?.valueIds[0])
  const [isOpenDieCutModal, setIsOpenDieCutModal] = useState(false)
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [selectedCardData, setSelectedCardData] = useState<any>(null);
  const [searchValue, setSearchValue] = useState("");



  const defaultObject = parameter.valuesConfigs.find(
    (item) => item.isDefault === true
  );
  const [newCategory, setNewCategory] = useState("");
  const [isView, setIsView] = useState(false);
  const [isRenderData, setIsRenderData] = useState(true)
  const [isViewInfoAfterGenerate, setIsViewInfoAfterGenerate] = useState(false)
  const [newDataGenerated, setNewDataGenerated] = useState<any>(null)
  useEffect(() => {
    if (lastOption) {
      setSearchResult([lastOption, ...parameter?.valuesConfigs])
    }
    else {
      setSearchResult(parameter?.valuesConfigs)
    }
  }, [parameter, isRenderData, lastOption])

  const onAddCategory = async () => {
    const callBack = (res) => {
      if (res.success) {
        getMaterialCategoryByMaterialKey(parameter?.materialPath[0].toString())
        alertSuccessAdded();
        setOpenModal(false);
      } else {
        alertFaultAdded();
      }
    }

    await addPrintHouseMaterialCategoryApi(callApi, callBack, {
      materialTypeKey: parameter?.materialPath[0].toString(),
      categoryKey: newCategory,

    })
  }

  const _renderSomeValues = (value: any) => {
    const additionalAttribute = value?.additionalAttribute || [];
    const attributes = additionalAttribute.reduce((acc, attr) => {
      acc[attr.valueId] = attr.value;
      return acc;
    }, {});

    const width = attributes.width;
    const length = attributes.length;
    const height = attributes.height;
    return `${width} * ${length} * ${height}`
  }
  const getParameterByCode = (subProducts, code) => {
    for (let subProduct of subProducts) {
      for (let parameter of subProduct.parameters) {
        if (parameter.parameterCode === code) {
          return parameter;
        }
      }
    }
    return null;
  };
  const AdvertisingCategory = getParameterByCode(subProducts, "AdvertisingProductCategory");
  const removeAdvertisingProductName = (subProducts) => {
    return subProducts.map(subProduct => {
      return {
        ...subProduct,
        parameters: subProduct.parameters.filter(parameter => parameter.parameterCode !== "AdvertisingProductName")
      };
    });
  };

  useEffect(() => {
    if (!AdvertisingCategory) {
      setSubProducts(removeAdvertisingProductName(subProducts));
    }
  }, [AdvertisingCategory]);
  const checkRequiredParameters = (subProducts: any[]): boolean => {
    const requiredParameterCodes = [
      "DieUnitWidth",
      "DieUnitLength",
      "DieUnitHeight",
    ];

    for (const product of subProducts) {
      const parameterCodes = product.parameters.map((param: any) => param.parameterCode);
      for (const requiredCode of requiredParameterCodes) {
        if (!parameterCodes.includes(requiredCode)) {
          return false;
        }
      }
    }
    return true;
  };
  useEffect(() => {
    if (newDieCutSelect && parameter?.code === "DieCutter") {
      const formattedData = {
        id: newDieCutSelect.rowData.code.value,
        activateAction: false,
        isDefault: false,
        isDeleted: false,
        isHidden: false,
        materialValueIds: null,
        selectedParameterValues: null,
        updateName: newDieCutSelect.rowData.name.value,
        values: [newDieCutSelect.rowData.name.value],
        additionalAttribute: [
          {
            valueId: "name",
            value: newDieCutSelect.rowData.name.value
          },
          {
            valueId: "image",
            value: newDieCutSelect.rowData.image.value
          },
          {
            valueId: "width",
            value: newDieCutSelect.rowData.width.value
          },
          {
            valueId: "length",
            value: newDieCutSelect.rowData.length.value
          },
          {
            valueId: "code",
            value: newDieCutSelect.rowData.code.value
          },
          {
            valueId: "shape",
            value: newDieCutSelect.rowData.shape.value
          },
          {
            valueId: "type",
            value: newDieCutSelect.rowData.type.value
          },
          {
            valueId: "unitWidth",
            value: newDieCutSelect.rowData.unitWidth.value
          },
          {
            valueId: "unitLength",
            value: newDieCutSelect.rowData.unitLength.value
          },
          {
            valueId: "finalUnitWidth",
            value: newDieCutSelect.rowData.finalUnitWidth.value
          },
          {
            valueId: "finalUnitLength",
            value: newDieCutSelect.rowData.finalUnitLength.value
          },
          {
            valueId: "finalUnitHeight",
            value: newDieCutSelect.rowData.finalUnitHeight.value
          },
          {
            valueId: "columnsAmount",
            value: newDieCutSelect.rowData.columnsAmount.value
          },
          {
            valueId: "linesAmount",
            value: newDieCutSelect.rowData.linesAmount.value
          },
          {
            valueId: "cuttingLineLength",
            value: newDieCutSelect.rowData.cuttingLineLength.value
          },
          {
            valueId: "scoringLineLength",
            value: newDieCutSelect.rowData.scoringLineLength.value
          },
          {
            valueId: "perforationLineLength",
            value: newDieCutSelect.rowData.perforationLineLength.value
          },
        ],
        currency: newDieCutSelect.rowData.currency.value
      };
      setSearchResult((prev: any) => {
        return [formattedData, ...prev,] // Add the new item to the data list
      });
      setLastOption(formattedData)
      setIsRenderData(false)
    }
  }, [newDieCutSelect])
  const [pdfUrl, setPdfUrl] = useState(null)
  const [dxfUrl, setDxfUrl] = useState(null)
  const [openCustomModal, setOpenCustomModal] = useState(false)
  const [customDimensions, setCustomDimensions] = useState({
    finalUnitWidth: "",
    finalUnitLength: "",
    finalUnitHeight: ""
  })
  const [openErrorModal, setOpenErrorModal] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const createNewTemplateEndPoint = async () => {
    setIsView(true)
    const unitWidth = subProducts.flatMap((item: any) => item.parameters).find((param: any) => param.parameterCode === "DieUnitWidth")?.values[0];
    const unitLength = subProducts.flatMap((item: any) => item.parameters).find((param: any) => param.parameterCode === "DieUnitLength")?.values[0];
    const unitHeight = subProducts.flatMap((item: any) => item.parameters).find((param: any) => param.parameterCode === "DieUnitHeight")?.values[0];
    const sheetWeight = subProducts.flatMap((item: any) => item.parameters).find((param: any) => param.parameterCode === "SheetWeight")?.values[0];
    const sheetcategory = subProducts.flatMap((item: any) => item.parameters).find((param: any) => param.parameterCode === "Sheetcategory")?.values[0];
    const sheetColor = subProducts.flatMap((item: any) => item.parameters).find((param: any) => param.parameterCode === "SheetColor")?.values[0];
    const unit = subProducts.flatMap((item: any) => item.parameters).find((param: any) => param.parameterCode === "DieUnitWidth")?.unitKey;
    const lidHeight = subProducts.flatMap((item: any) => item.parameters).find((param: any) => param.parameterCode === "LidHeight")?.values[0];

    const reqObj = {
      dieCutCategory: category,
      unitWidth: Number(unitWidth),
      unitLength: Number(unitLength),
      unitHeight: Number(unitHeight),
      lidHeight: lidHeight,
      sheetsWeight: sheetWeight,
      sheetsCategory: sheetcategory,
      sheetsColor: sheetColor,
      unit: unit,
    }
    const callBack = (res) => {
      if (res?.isOkay) {
        setPdfUrl(res.data.pdfUrl)
        setDxfUrl(res.data.dxfUrl)
        getAllMaterial().then((materials) => {
          // getProductById(materials);
        });
        if (parameter?.code === "DieCutter") {
          const formattedData = {
            id: res.data.data.id,
            activateAction: false,
            isDefault: false,
            isDeleted: false,
            isHidden: false,
            materialValueIds: null,
            selectedParameterValues: null,
            updateName: res.data.data.rowData.name.value,
            values: [res.data.data.rowData.name.value],
            additionalAttribute: [
              {
                valueId: "name",
                value: res.data.data.rowData.name.value
              },
              {
                valueId: "image",
                value: res.data.data.rowData.image.value
              },
              {
                valueId: "width",
                value: res.data.data.rowData.width.value
              },
              {
                valueId: "length",
                value: res.data.data.rowData.length.value
              },
              {
                valueId: "code",
                value: res.data.data.rowData.code.value
              },
              {
                valueId: "shape",
                value: res.data.data.rowData.shape.value
              },
              {
                valueId: "type",
                value: res.data.data.rowData.type.value
              },
              {
                valueId: "unitWidth",
                value: res?.data?.data?.rowData?.unitWidth?.value
              },
              {
                valueId: "unitLength",
                value: res?.data?.data?.rowData?.unitLength?.value
              },
              {
                valueId: "finalUnitWidth",
                value: res?.data?.data?.rowData?.finalUnitWidth?.value
              },
              {
                valueId: "finalUnitLength",
                value: res?.data?.data?.rowData?.finalUnitLength?.value
              },
              {
                valueId: "finalUnitHeight",
                value: res?.data?.data?.rowData?.finalUnitHeight?.value
              },
              {
                valueId: "columnsAmount",
                value: res?.data?.data?.rowData?.columnsAmount?.value
              },
              {
                valueId: "linesAmount",
                value: res?.data?.data?.rowData?.linesAmount?.value
              },
              {
                valueId: "cuttingLineLength",
                value: res?.data?.data?.rowData?.cuttingLineLength?.value
              },
              {
                valueId: "scoringLineLength",
                value: res?.data?.data?.rowData?.scoringLineLength?.value
              },
              {
                valueId: "perforationLineLength",
                value: res?.data?.data?.rowData?.perforationLineLength?.value
              },
            ],
          };
          setSearchResult((prev: any) => {
            return [formattedData, ...prev,] // Add the new item to the data list
          });
          setLastOption(formattedData)
          setIsView(false)
          setIsRenderData(false)

          setIsViewInfoAfterGenerate(true)
          setNewDataGenerated(res.data.data)
        }

      } else {
        // Use custom error modal instead of alertFault
        if (res?.resultMessage) {
          setErrorMessage(t(`${res?.resultMessage}`));
        } else {
          setErrorMessage(t("products.offsetPrice.admin.errorAddingTemplate"));
        }

        // Close all other modals before showing error modal
        setOpenCustomModal(false);
        setOpenGenerateModal(false);
        setOpenModal(false);
        setIsOpenDieCutModal(false);
        setOpenErrorModal(true);
        setIsView(false);
        setIsViewInfoAfterGenerate(false);
      }
    };
    await createDieCutFromTemplateMakerApi(callApi, callBack, reqObj);
  }

  const createNewTemplate = () => {
    // Check if this is the special templateId that needs custom dimensions
    if (productTemplate?.templateId === "b47bf700-e3fc-4dff-a5fd-638821dc9e25") {
      setOpenCustomModal(true);
      return;
    }

    const result = checkRequiredParameters(subProducts);
    if (result) {
      setOpenGenerateModal(true)
    } else {
      // Use custom error modal instead of alertFault
      setErrorMessage(t("products.offsetPrice.admin.errorMakerTemplate1"));

      // Close all other modals before showing error modal
      setOpenCustomModal(false);
      setOpenGenerateModal(false);
      setOpenModal(false);
      setIsOpenDieCutModal(false);
      setOpenErrorModal(true);
    }
  }

  const createNewTemplateWithCustomDimensions = async () => {
    setIsView(true)
    setOpenCustomModal(false)
    setOpenGenerateModal(true)

    const sheetWeight = subProducts.flatMap((item: any) => item.parameters).find((param: any) => param.parameterCode === "SheetWeight")?.values[0];
    const sheetcategory = subProducts.flatMap((item: any) => item.parameters).find((param: any) => param.parameterCode === "Sheetcategory")?.values[0];
    const sheetColor = subProducts.flatMap((item: any) => item.parameters).find((param: any) => param.parameterCode === "SheetColor")?.values[0];
    const unit = subProducts.flatMap((item: any) => item.parameters).find((param: any) => param.parameterCode === "DieUnitWidth")?.unitKey;
    const lidHeight = subProducts.flatMap((item: any) => item.parameters).find((param: any) => param.parameterCode === "LidHeight")?.values[0];

    const reqObj = {
      dieCutCategory: category,
      unitWidth: Number(customDimensions.finalUnitWidth),
      unitLength: Number(customDimensions.finalUnitLength),
      unitHeight: Number(customDimensions.finalUnitHeight),
      lidHeight: lidHeight,
      sheetsWeight: sheetWeight,
      sheetsCategory: sheetcategory,
      sheetsColor: sheetColor,
      unit: unit,
    }

    const callBack = (res) => {
      if (res?.isOkay) {
        setPdfUrl(res.data.pdfUrl)
        setDxfUrl(res.data.dxfUrl)
        getAllMaterial().then((materials) => {
          // getProductById(materials);
        });
        if (parameter?.code === "DieCutter") {
          const formattedData = {
            id: res.data.data.id,
            activateAction: false,
            isDefault: false,
            isDeleted: false,
            isHidden: false,
            materialValueIds: null,
            selectedParameterValues: null,
            updateName: res.data.data.rowData.name.value,
            values: [res.data.data.rowData.name.value],
            additionalAttribute: [
              {
                valueId: "name",
                value: res.data.data.rowData.name.value
              },
              {
                valueId: "image",
                value: res.data.data.rowData.image.value
              },
              {
                valueId: "width",
                value: res.data.data.rowData.width.value
              },
              {
                valueId: "length",
                value: res.data.data.rowData.length.value
              },
              {
                valueId: "code",
                value: res.data.data.rowData.code.value
              },
              {
                valueId: "shape",
                value: res.data.data.rowData.shape.value
              },
              {
                valueId: "type",
                value: res.data.data.rowData.type.value
              },
              {
                valueId: "unitWidth",
                value: res?.data?.data?.rowData?.unitWidth?.value
              },
              {
                valueId: "unitLength",
                value: res?.data?.data?.rowData?.unitLength?.value
              },
              {
                valueId: "finalUnitWidth",
                value: res?.data?.data?.rowData?.finalUnitWidth?.value
              },
              {
                valueId: "finalUnitLength",
                value: res?.data?.data?.rowData?.finalUnitLength?.value
              },
              {
                valueId: "finalUnitHeight",
                value: res?.data?.data?.rowData?.finalUnitHeight?.value
              },
              {
                valueId: "columnsAmount",
                value: res?.data?.data?.rowData?.columnsAmount?.value
              },
              {
                valueId: "linesAmount",
                value: res?.data?.data?.rowData?.linesAmount?.value
              },
              {
                valueId: "cuttingLineLength",
                value: res?.data?.data?.rowData?.cuttingLineLength?.value
              },
              {
                valueId: "scoringLineLength",
                value: res?.data?.data?.rowData?.scoringLineLength?.value
              },
              {
                valueId: "perforationLineLength",
                value: res?.data?.data?.rowData?.perforationLineLength?.value
              },
            ],
          };
          setSearchResult((prev: any) => {
            return [formattedData, ...prev,] // Add the new item to the data list
          });
          setLastOption(formattedData)
          setIsView(false)
          setIsRenderData(false)

          setIsViewInfoAfterGenerate(true)
          setNewDataGenerated(res.data.data)
        }

      } else {
        // Use custom error modal instead of alertFault for createNewTemplateWithCustomDimensions
        if (res?.resultMessage) {
          setErrorMessage(t(`${res?.resultMessage}`));
        } else {
          setErrorMessage(t("products.offsetPrice.admin.errorAddingTemplate"));
        }

        // Close all other modals before showing error modal
        setOpenCustomModal(false);
        setOpenGenerateModal(false);
        setOpenModal(false);
        setIsOpenDieCutModal(false);
        setOpenErrorModal(true);
        setIsView(false);
        setIsViewInfoAfterGenerate(false);
      }
    };
    await createDieCutFromTemplateMakerApi(callApi, callBack, reqObj);
  }


  const getMaterialCategoryByMaterialKey = async (material) => {
    const callBack = (res) => {
      if (res?.success) {
        getAllMaterial().then((materials) => {
          getProductById(materials);
        });
      }
    };
    await getMaterialCategoryByMaterialKeyApi(callApi, callBack, material);
  };


  const viewRequiredParameters = (subProducts: any[]): { parameterInfo: string[], isComplete: boolean } => {
    const requiredParameterCodes = [
      "DieUnitWidth",
      "DieUnitLength",
      "DieUnitHeight",
      "LidHeight"
    ];

    const foundParameters = subProducts.flatMap(product =>
      product.parameters.filter(param =>
        requiredParameterCodes.includes(param.parameterCode)
      )
    );
    const parameterInfo = foundParameters.map(param => {
      return `${param.parameterName}: ${param.values[0]}${param.unitKey ? ` ${param.unitKey}` : ''}`
    }

    );

    return {
      parameterInfo,
      isComplete: foundParameters.length === requiredParameterCodes.length
    };
  };

  useEffect(() => {
    if (parameter?.code === "DiecutType") {
      if (selectedDieCutTypeValue) {
        setSelectedCardId(selectedDieCutTypeValue.id)
        setSelectedCardData(selectedDieCutTypeValue)
      }
    }
    else if (parameter?.code === "DieCutter") {
      if (selectedDieCutterValue) {
        setSelectedCardId(selectedDieCutterValue.id)
        setSelectedCardData(selectedDieCutterValue)
      }
    }
  }, [selectedDieCutTypeValue, selectedDieCutterValue])
  return {
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
    getMaterialCategoryByMaterialKey,
    openGenerateModal,
    setOpenGenerateModal,
    viewRequiredParameters,
    subProducts,
    createNewTemplateEndPoint,
    isView,
    setIsView,
    setIsRenderData,
    isViewInfoAfterGenerate,
    setIsViewInfoAfterGenerate,
    newDataGenerated,
    setSubProducts,
    isOpenDieCutModal,
    setIsOpenDieCutModal,
    selectedCardId,
    selectedCardData,
    searchValue,
    setSearchValue,
    selectedDieCutTypeValue,
    setSelectedCardId,
    setSelectedCardData,
    setLastOption,
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
    errorMessage
  };
};

export { useAdvertisingProductName };
