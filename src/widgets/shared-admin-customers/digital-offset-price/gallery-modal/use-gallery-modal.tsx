import { useCallback, useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";

import {
  materialBtnDataState,
  selectParameterButtonState,
  subProductsParametersState
} from "@/store";
import { getPrintHouseMaterialsByMaterialKey } from "@/services/hooks";
import { materialsCategoriesState } from "@/store/material-categories";
import { compareStrings, findDefaultOption, findParameterByCode, getParameterByParameterCode } from "@/utils/constants";
import { useGomakeAxios, useSnackBar } from "@/hooks";
import { selectedShapeState } from "./gallery-modal-store";
import { StaightKnifeIcon, OrderNowIcon } from "./icons";
import { useTranslation } from "react-i18next";
import { EHttpMethod } from "@/services/api-service/enums";
import { filterState } from "@/widgets/materials-widget/state";
import { useRouter } from "next/router";

const useGalleryModal = ({ onClose, onChangeSubProductsForPrice, setIsChargeForNewDie, straightKnife, isParameterSettings, getProductById, template, _getParameter }) => {
  const { callApi } = useGomakeAxios();
  const { alertFaultAdded, alertSuccessAdded } = useSnackBar();
  const { t } = useTranslation();
  const router = useRouter()
  const selectParameterButton = useRecoilValue<any>(selectParameterButtonState);
  const subProducts = useRecoilValue<any>(subProductsParametersState);
  const materialsEnumsValues = useRecoilValue(materialsCategoriesState);
  const [selectedShape, setSelectedShape] = useRecoilState<any>(selectedShapeState);

  const [materialData, setMaterialData] =
    useRecoilState<any>(materialBtnDataState);
  const [materialDataFilter, setMaterialDataFilter] = useState("");
  const [materialType, setMaterialType] = useState<any>({});
  const [isShowStraightKnife, setIsShowStraightKnife] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [materialTableFilters, setMaterialTableFilters] = useState([])
  const [shapeCodeDefualt, setShapeCodeDefualt] = useState<any>({})

  const dieCutParameterForSettings = findParameterByCode(template, "DieCut")
  const dieKissCutParameterForSettings = findParameterByCode(template, "DieKissCut")
  const dieCutterParameterForSettings = findParameterByCode(template, "DieCutter")
  const dieStampParameterForSettings = findParameterByCode(template, selectParameterButton?.parameter?.materialPath[0] === "DieStamp" ? "Enhancementtype" : "Shape")
  const isDiesParameter =
    (selectParameterButton?.parameter?.code
      ? findParameterByCode(template, selectParameterButton?.parameter?.code)
      : null) || dieCutParameterForSettings || dieKissCutParameterForSettings || dieCutterParameterForSettings
  const filteredMaterialData = !isParameterSettings
    ? materialData?.data?.filter(item => {
      const config = isDiesParameter?.valuesConfigs.find(config => config.id === item.id);
      return config ? !config.isHidden : true;
    })
    : materialData?.data;


  useEffect(() => {
    if (isParameterSettings) {
      const shapeParameterForSettings = findParameterByCode(template, "Shape")
      if (shapeParameterForSettings) {
        const defultShape = findDefaultOption(shapeParameterForSettings)
        if (defultShape) {
          setShapeCodeDefualt(defultShape)
        }

      }

    }
  }, [isParameterSettings, template])
  const widthParameter = getParameterByParameterCode(
    subProducts,
    "Width"
  );
  const heightParameter = getParameterByParameterCode(
    subProducts,
    "Height"
  );
  const finalUnitWidthParameter = getParameterByParameterCode(
    subProducts,
    "DieUnitWidth",

  );
  const finalUnitLengthParameter = getParameterByParameterCode(
    subProducts,
    "DieUnitLength"
  );
  const finalUnitHeightParameter = getParameterByParameterCode(
    subProducts,
    "DieUnitHeight"
  );
  const shapeParameter = getParameterByParameterCode(subProducts, selectParameterButton?.parameter?.materialPath[0] === "DieStamp" ? "Enhancementtype" : "Shape")
  const LabelShapeParameter = getParameterByParameterCode(subProducts, "LabelsShape")
  useEffect(() => {
    if (selectParameterButton?.parameter?.materialPath?.length > 0) {
      getProductQuoteItemById();
      const data = materialsEnumsValues.find((item) => {
        return compareStrings(
          item.name,
          selectParameterButton?.parameter?.materialPath[0]
        );
      });
      setMaterialType(data);
    }
  }, [selectParameterButton, materialsEnumsValues]);

  useEffect(() => {
    if (selectParameterButton?.parameter?.materialPath?.length > 0 && selectParameterButton?.parameter?.materialPath[0] === "DieKissCut") {
      CheckOptionToStraightKnife()
    }
  }, [selectParameterButton]);

  const getProductQuoteItemById = useCallback(async () => {
    setIsLoading(true)
    const shapeId = shapeParameter && shapeParameter.valueIds && shapeParameter.valueIds.length ? shapeParameter.valueIds[0] : "";
    let shapeCode = "";
    if (shapeId) {
      if (shapeParameter?.valuesConfigs && shapeParameter?.valuesConfigs?.length > 0) {
        const value = shapeParameter?.valuesConfigs.find(x => x.id === shapeId)
        shapeCode = value?.code;
      }
      else {
        const value = dieStampParameterForSettings?.valuesConfigs.find(x => x.id === shapeId)
        shapeCode = value?.code;
      }
    }
    const reqObj = {
      key: selectParameterButton?.parameter?.materialPath[0],
      width: widthParameter && widthParameter.values && widthParameter.values.length > 0 && widthParameter.values[0] ? widthParameter.values[0] : 0,
      length: heightParameter && heightParameter.values && heightParameter.values.length > 0 && heightParameter.values[0] ? heightParameter.values[0] : 0,
      shape: isParameterSettings ? shapeCodeDefualt?.code : shapeCode || "",
      ...(router.query.customerId !== "00000000-0000-0000-0000-000000000000" && { clientId: router.query.customerId }),
      finalWidth: finalUnitWidthParameter && finalUnitWidthParameter.values && finalUnitWidthParameter.values.length > 0 && finalUnitWidthParameter.values[0] ? finalUnitWidthParameter.values[0] : 0,
      finalLength: finalUnitLengthParameter && finalUnitLengthParameter.values && finalUnitLengthParameter.values.length > 0 && finalUnitLengthParameter.values[0] ? finalUnitLengthParameter.values[0] : 0,
      finalHeight: finalUnitHeightParameter && finalUnitHeightParameter.values && finalUnitHeightParameter.values.length > 0 && finalUnitHeightParameter.values[0] ? finalUnitHeightParameter.values[0] : 0,
    }
    const res = await getPrintHouseMaterialsByMaterialKey(callApi, setMaterialData, reqObj);
    if (res?.data?.length > 0) {
      setIsLoading(false)
    }
    if (res?.filters?.length > 0) {
      setMaterialTableFilters(res?.filters)
    }
  }, [selectParameterButton, widthParameter, heightParameter, finalUnitWidthParameter, finalUnitLengthParameter, finalUnitHeightParameter]);
  const [filters, setFilters] = useRecoilState<any>(filterState);



  const setFilterValue = (key: string, value: string | string[]) => {
    const updatedFilters =
      value && !(Array.isArray(value) && value.length === 0)
        ? [
          ...filters.filter((x) => x.key !== key),
          {
            key: key,
            value: value
          },
        ]
        : filters.filter((x) => x.key !== key);

    setFilters(updatedFilters);
  };
  const createParameterForCalculation = (parameter) => {
    if (isstraightKnifeSelected) {
      setIsstraightKnifeSelected(false)
    }
    setSelectedShape(parameter);

  };
  const createParameterForCalculationHidden = async (valueConfig) => {
    const existingConfig = isDiesParameter?.valuesConfigs.find(
      (config) => config.id === valueConfig.id
    );
    const updatedShape = {
      ...valueConfig,
      isHidden: !existingConfig?.isHidden,
    };

    await updateProductParameterEndPoint(
      selectParameterButton?.sectionId,
      selectParameterButton?.subSectionId,
      {
        parameter: {
          ...isDiesParameter,
          valuesConfigs: [
            ...isDiesParameter?.valuesConfigs.filter(
              (config) => config.id !== valueConfig.id
            ),
            updatedShape,
          ],
        },
      }
    );
  };
  const searchByNameOrType = (items, searchText) => {
    searchText = searchText?.toLowerCase();

    const result = items?.filter((item) => {
      // Existing searches
      const nameMatch = item.rowData.name.value.toLowerCase().includes(searchText);
      const typeMatch = Array.isArray(item?.rowData?.type?.value) &&
        item?.rowData?.type?.value.some(type => type?.toLowerCase().includes(searchText));
      const categoryMatch = item?.category?.toLowerCase()?.includes(searchText);
      const codeMatch = item?.rowData?.code?.value?.toLowerCase().includes(searchText);

      // New search for unitWidth x unitLength combination
      const unitWidth = item?.rowData?.unitWidth?.value;
      const unitLength = item?.rowData?.unitLength?.value;
      let dimensionMatch = false;

      if (unitWidth && unitLength) {
        // Create different possible combinations
        const dimensionCombinations = [
          `${unitWidth}x${unitLength}`,
          `${unitWidth}X${unitLength}`,
          `${unitLength}x${unitWidth}`,
          `${unitLength}X${unitWidth}`,
          // Handle formats with different decimal places
          `${parseFloat(unitWidth)}x${parseFloat(unitLength)}`,
          `${parseFloat(unitWidth)}X${parseFloat(unitLength)}`,
          `${parseFloat(unitLength)}x${parseFloat(unitWidth)}`,
          `${parseFloat(unitLength)}X${parseFloat(unitWidth)}`
        ];

        dimensionMatch = dimensionCombinations.some(combo =>
          combo.toLowerCase().includes(searchText) ||
          searchText.includes(combo.toLowerCase())
        );
      }

      return nameMatch || typeMatch || categoryMatch || codeMatch || dimensionMatch;
    });

    return result;
  }
  const [searchResult, setSearchResult] = useState<any>([])
  useEffect(() => {
    if (materialDataFilter) {
      setSearchResult(searchByNameOrType(filteredMaterialData, materialDataFilter))
    }
  }, [materialDataFilter])
  // const searchResult = searchByNameOrType(filteredMaterialData, materialDataFilter);
  const onChangeSearch = (value: string) => {
    setMaterialDataFilter(value);
  };
  const [changeDefaultValue, setChangeDefaultValue] = useState<any>();
  useEffect(() => {
    if (selectedShape) {
      const updatedShape = { ...selectedShape, isDefault: true };
      setChangeDefaultValue(updatedShape);
    }
  }, [selectedShape])


  const onClickChoosParameter = () => {
    setMaterialDataFilter("")
    if (isParameterSettings) {
      updatedProductParameteDefaultValue(selectParameterButton?.sectionId, selectParameterButton?.subSectionId, selectParameterButton?.parameter)
    }
    else {
      if (isstraightKnifeSelected) {
        onClose();

      }
      else {
        onChangeSubProductsForPrice(
          selectParameterButton?.parameter?.id,
          selectParameterButton?.subSectionId,
          selectParameterButton?.sectionId,
          selectParameterButton?.parameter?.parameterType,
          selectParameterButton?.parameter?.name,
          selectParameterButton?.parameter?.actionId,
          {
            valueIds: selectedShape?.id,
            values: selectedShape?.rowData?.name?.value,
            ...(materialType?.id > 0 && { material: materialType?.id }),
          },
          selectParameterButton?.paameterType,
          selectParameterButton?.index,
          selectParameterButton?.parameter?.actionIndex,
          selectParameterButton?.parameter?.code,
          selectedShape
        );
      }
      // setMaterialData([])

    }
    onClose();
  };
  const onClickNewOrder = () => {
    setIsChargeForNewDie(true);
    window.open(`/materials/${selectParameterButton?.parameter?.materialPath[0]}`, "_blank");
  };
  const [isstraightKnifeSelected, setIsstraightKnifeSelected] = useState(false)
  const onClickStraight = () => {
    createParameterForCalculation(null)
    createParameterForCalculationHidden(null)
    setIsstraightKnifeSelected(true)
    onChangeSubProductsForPrice(
      straightKnife?.id,
      selectParameterButton?.subSectionId,
      selectParameterButton?.sectionId,
      straightKnife?.parameterType,
      straightKnife?.name,
      straightKnife?.actionId,
      { values: "true" },
      selectParameterButton?.paameterType,
      selectParameterButton?.index,
      straightKnife?.actionIndex,
      straightKnife?.code
    );
    // onClose();
  };
  const fixedCartData = [
    {
      name: t("products.offsetPrice.admin.orderNewDie"),
      icon: <OrderNowIcon />,
      onclick: onClickNewOrder,
      onDoubleClick: () => null,
      backgroundColor: "#504FA1",
      isShow: true,
    },
    // {
    //   name: t("products.offsetPrice.admin.AddExistingDie"),
    //   icon: <AddNewIcon />,
    //   onclick: onClickAddExisting,
    //   backgroundColor: "#8283BE",
    // },
    {
      name: t("products.offsetPrice.admin.straightKnife"),
      icon: <StaightKnifeIcon />,
      onclick: onClickStraight,
      onDoubleClick: onClickChoosParameter,
      backgroundColor: "#F467BA",
      isShow: isShowStraightKnife
    },
  ];
  const [renderData, setRenderData] = useState([]);
  useEffect(() => {
    const renderData = materialDataFilter ? searchResult : materialData;
    setRenderData(renderData);
  }, [materialDataFilter]);
  const CheckOptionToStraightKnife = useCallback(async () => {
    const shapeIdForValues = shapeParameter && shapeParameter.valueIds && shapeParameter.valueIds.length ? shapeParameter.valueIds[0] : "";

    const width = widthParameter && widthParameter.values && widthParameter.values.length > 0 ? +widthParameter?.values[0] : 0;
    const height = heightParameter && heightParameter.values && heightParameter.values.length > 0 ? +heightParameter?.values[0] : 0;
    const shapeId = isParameterSettings
      ? shapeCodeDefualt?.id
      : shapeParameter ? shapeIdForValues : LabelShapeParameter?.parameterId;

    const res = await callApi(
      EHttpMethod.POST,
      `/v1/calculation-service/calculations/check-option-to-straight-knife?width=${width}&length=${height}&shapeId=${shapeId}&materialTypeKey=${selectParameterButton?.parameter?.materialPath[0]}`,

    );
    if (res?.success) {
      setIsShowStraightKnife(res.data?.data?.data)
    }
  }, [widthParameter, heightParameter, shapeParameter, LabelShapeParameter, selectParameterButton]);
  const updatedProductParameteDefaultValue = useCallback(
    async (sectionId: string, subSectionId: string, parameter: any) => {
      if (!isDiesParameter || !isDiesParameter?.valuesConfigs) return;
      const currentDefault = isDiesParameter.valuesConfigs.find((config) => config?.isDefault);
      const selectedId = changeDefaultValue?.id;
      if (!selectedId) return;
      if (currentDefault?.id === selectedId) {
        setChangeDefaultValue("");
        return;
      }
      // Ensure name/image are persisted for the selected die so UI can render after refresh
      const rd = changeDefaultValue?.rowData || {};
      const get = (k: string) => rd?.[k]?.value;
      const additionalAttribute = [
        { valueId: "name", value: get("name") },
        { valueId: "image", value: get("image") },
        { valueId: "width", value: get("width") },
        { valueId: "length", value: get("length") },
        { valueId: "code", value: get("code") },
        { valueId: "shape", value: get("shape") },
        { valueId: "type", value: get("type") },
        { valueId: "unitWidth", value: get("unitWidth") },
        { valueId: "unitLength", value: get("unitLength") },
        { valueId: "finalUnitWidth", value: get("finalUnitWidth") },
        { valueId: "finalUnitLength", value: get("finalUnitLength") },
        { valueId: "finalUnitHeight", value: get("finalUnitHeight") },
        { valueId: "columnsAmount", value: get("columnsAmount") },
        { valueId: "linesAmount", value: get("linesAmount") },
        { valueId: "cuttingLineLength", value: get("cuttingLineLength") },
        { valueId: "scoringLineLength", value: get("scoringLineLength") },
        { valueId: "perforationLineLength", value: get("perforationLineLength") },
        { valueId: "dieUnitWidth", value: get("dieUnitWidth") },
        { valueId: "dieUnitLength", value: get("dieUnitLength") },
      ].filter((x) => x.value !== undefined && x.value !== null);

      // Sanitize existing configs to only allowed fields
      const sanitizeConfig = (cfg: any, makeDefault: boolean) => ({
        id: cfg?.id,
        activateAction: cfg?.activateAction || false,
        isDefault: !!makeDefault,
        isDeleted: !!cfg?.isDeleted,
        isHidden: !!cfg?.isHidden,
        materialValueIds: cfg?.materialValueIds ?? null,
        selectedParameterValues: cfg?.selectedParameterValues ?? null,
        updateName: makeDefault ? (get("name") || cfg?.updateName) : cfg?.updateName,
        // API expects a dictionary here; ensure object, not array
        values: (cfg && typeof cfg.values === 'object' && !Array.isArray(cfg.values)) ? cfg.values : {},
        additionalAttribute: makeDefault
          ? (additionalAttribute?.length > 0 ? additionalAttribute : cfg?.additionalAttribute)
          : cfg?.additionalAttribute,
        ...(rd?.currency?.value ? { currency: rd?.currency?.value } : (cfg?.currency ? { currency: cfg.currency } : {})),
      });

      // Map or append
      let found = false;
      const updatedValuesConfigs = (isDiesParameter.valuesConfigs || []).map((config) => {
        if (config.id === selectedId) {
          found = true;
          return sanitizeConfig(config, true);
        }
        return sanitizeConfig(config, false);
      });

      if (!found) {
        updatedValuesConfigs.push({
          id: selectedId,
          activateAction: false,
          isDefault: true,
          isDeleted: false,
          isHidden: false,
          materialValueIds: null,
          selectedParameterValues: null,
          updateName: get("name"),
          values: {},
          additionalAttribute: additionalAttribute,
          ...(rd?.currency?.value ? { currency: rd?.currency?.value } : {}),
        });
      }
      await updateProductParameterEndPoint(sectionId, subSectionId, {
        parameter: {
          ...isDiesParameter,
          valuesConfigs: updatedValuesConfigs,
        },
      });
      setChangeDefaultValue("");
    },
    [router, changeDefaultValue, isDiesParameter]
  );


  const updateProductParameterEndPoint = async (
    sectionId: string,
    subSectionId: string,
    data: any
  ) => {
    const res = await callApi(
      "PUT",
      `/v1/printhouse-config/products/update-product-parameter`,
      {
        productId: router?.query?.id,
        sectionId: sectionId,
        subSectionId: subSectionId,
        productParameterType: 1,
        ...data,
      }
    );
    if (res?.success) {
      alertSuccessAdded()
      getProductById();
    } else {
      alertFaultAdded()
    }
  };


  function findParameterInTemplate(template, parameterCodes) {
    let foundParameters = [];

    // Helper function to search within a given section or subsection
    function searchParameters(parameters, sectionId, subSectionId) {
      parameters.forEach(param => {
        if (parameterCodes.includes(param.code)) {
          foundParameters.push({ ...param, sectionId, subSectionId });
        }
      });
    }

    // Iterate through sections and their subsections
    template?.sections?.forEach(section => {
      section.subSections.forEach(subSection => {
        searchParameters(subSection.parameters, section.id, subSection.id);
      });
    });

    return foundParameters;
  }
  const getSectionById = (template, sectionId) => {
    const section = template?.sections?.find(section => section.id === sectionId);
    if (section) {
      return {
        section,
        subSections: section.subSections || []
      };
    }
    return null;
  };
  const getSubSectionById = (template, sectionId, subSectionId) => {
    const section = template?.sections?.find(section => section.id === sectionId);
    if (section) {
      const subSection = section.subSections.find(subSec => subSec.id === subSectionId);
      return subSection || null;
    }
    return null;
  };
  const addChargeForNewDieParameter: any = findParameterInTemplate(template, ["AddChargeForNewDie"]);
  const [sectionId, setSectionId] = useState<any>({})
  const [subSectionId, setSubSectionId] = useState<any>({})
  const [value, setValueState] = useState<any>()


  useEffect(() => {
    if (template && !isParameterSettings && addChargeForNewDieParameter?.length > 0) {
      const SectionId = getSectionById(template, addChargeForNewDieParameter[0]?.sectionId);
      const subSectionId = getSubSectionById(template, addChargeForNewDieParameter[0]?.sectionId, addChargeForNewDieParameter[0]?.subSectionId);
      const value = _getParameter(addChargeForNewDieParameter[0], subSectionId, SectionId);

      setSectionId(SectionId)
      setSubSectionId(subSectionId)
      setValueState(value)
    }
  }, [template])

  const checkRequiredParameters = (subProducts: any[]): boolean => {
    const requiredParameterCodes = [
      "DieUnitWidth",
      "DieUnitLength",
      "DieUnitHeight",
      // "Width",
      // "Height",
      // "Sheetcategory",
      // "SheetWeight",
      // "SheetColor"
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
    // Do not auto-apply defaults for dies; always wait for user modal selection
    return;
  }, [isDiesParameter, materialData, isParameterSettings]);

  return {
    materialData,
    selectedShape,
    createParameterForCalculation,
    createParameterForCalculationHidden,
    onClickChoosParameter,
    fixedCartData,
    getProductQuoteItemById,
    onChangeSearch,
    searchResult,
    materialDataFilter,
    renderData,
    materialTableFilters,
    setMaterialDataFilter,
    setMaterialTableFilters,
    setFilterValue,
    addChargeForNewDieParameter,
    subSectionId,
    sectionId,
    value,
    isLoading,
    selectParameterButton,
    setMaterialData,
    filteredMaterialData,
    isDiesParameter,
    checkRequiredParameters,
    subProducts,
    setSearchResult
  };
};

export { useGalleryModal };
