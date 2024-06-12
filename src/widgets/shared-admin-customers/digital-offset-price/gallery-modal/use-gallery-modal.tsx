import { useCallback, useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";

import {
  materialBtnDataState,
  selectParameterButtonState,
  subProductsParametersState
} from "@/store";
import { getPrintHouseMaterialsByMaterialKey } from "@/services/hooks";
import { materialsCategoriesState } from "@/store/material-categories";
import { compareStrings, getParameterByParameterCode } from "@/utils/constants";
import { useGomakeAxios } from "@/hooks";
import { selectedShapeState } from "./gallery-modal-store";
import { StaightKnifeIcon, OrderNowIcon } from "./icons";
import { useTranslation } from "react-i18next";
import { EHttpMethod } from "@/services/api-service/enums";
import { filterState } from "@/widgets/materials-widget/state";
import { useRouter } from "next/router";

const useGalleryModal = ({ onClose, onChangeSubProductsForPrice, setIsChargeForNewDie, straightKnife }) => {

  const { callApi } = useGomakeAxios();
  const { t } = useTranslation();
  const router = useRouter()
  const selectParameterButton = useRecoilValue<any>(selectParameterButtonState);
  const subProducts = useRecoilValue<any>(subProductsParametersState);
  const materialsEnumsValues = useRecoilValue(materialsCategoriesState);
  const [selectedShape, setSelectedShape] =
    useRecoilState<any>(selectedShapeState);
  const [materialData, setMaterialData] =
    useRecoilState<any>(materialBtnDataState);
  const [materialDataFilter, setMaterialDataFilter] = useState("");
  const [materialType, setMaterialType] = useState<any>({});
  const [isShowStraightKnife, setIsShowStraightKnife] = useState(false)
  const [materialTableFilters, setMaterialTableFilters] = useState([])
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
      "DieUnitWidth"
  );
  const finalUnitLengthParameter = getParameterByParameterCode(
      subProducts,
      "DieUnitLength"
  );
  const finalUnitHeightParameter = getParameterByParameterCode(
      subProducts,
      "DieUnitHeight"
  );
  const shapeParameter = getParameterByParameterCode(subProducts, "Shape")
  const LabelShapeParameter = getParameterByParameterCode(subProducts, "LabelsShape")
  useEffect(() => {
    if (selectParameterButton?.parameter?.materialPath?.length > 0) {
      getProductQuoteItemById();
      CheckOptionToStraightKnife()
      const data = materialsEnumsValues.find((item) => {
        return compareStrings(
          item.name,
          selectParameterButton?.parameter?.materialPath[0]
        );
      });
      setMaterialType(data);
    }
  }, [selectParameterButton, materialsEnumsValues]);

  const getProductQuoteItemById = useCallback(async () => {
    const shapeId = shapeParameter && shapeParameter.valueIds && shapeParameter.valueIds.length ? shapeParameter.valueIds[0] : "";
    let shapeCode = "";
    if (shapeId) {
      const value = shapeParameter?.valuesConfigs.find(x => x.id === shapeId)
      shapeCode = value?.code;
    }
    const reqObj = {
      key: selectParameterButton?.parameter?.materialPath[0],
      width: widthParameter && widthParameter.values && widthParameter.values.length > 0 && widthParameter.values[0] ? widthParameter.values[0] : 0,
      length: heightParameter && heightParameter.values && heightParameter.values.length > 0 && heightParameter.values[0] ? heightParameter.values[0] : 0,
      shape: shapeCode,
      clientId: router.query.customerId,
      finalWidth: finalUnitWidthParameter && finalUnitWidthParameter.values && finalUnitWidthParameter.values.length > 0 && finalUnitWidthParameter.values[0] ? finalUnitWidthParameter.values[0] : 0,
      finalLength: finalUnitLengthParameter && finalUnitLengthParameter.values && finalUnitLengthParameter.values.length > 0 && finalUnitLengthParameter.values[0] ? finalUnitLengthParameter.values[0] : 0,
      finalHeight: finalUnitHeightParameter && finalUnitHeightParameter.values && finalUnitHeightParameter.values.length > 0 && finalUnitHeightParameter.values[0] ? finalUnitHeightParameter.values[0] : 0,
    }
    const res = await getPrintHouseMaterialsByMaterialKey(callApi, setMaterialData,reqObj );
    if (res?.filters?.length > 0) {
      setMaterialTableFilters(res?.filters)
    }
  }, [selectParameterButton, widthParameter, heightParameter,finalUnitWidthParameter,finalUnitLengthParameter,finalUnitHeightParameter]);
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
    setSelectedShape(parameter);
  };
  function searchByNameOrType(items, searchText) {
    searchText = searchText?.toLowerCase();

    const result = items?.filter((item) =>
      item.rowData.name.value.toLowerCase().includes(searchText) ||
      (item?.rowData?.type?.value && item?.rowData?.type?.value?.some(type => type?.toLowerCase().includes(searchText))
        ||
        item?.category?.toLowerCase()?.includes(searchText))
    );

    return result;
  }

  const searchResult = searchByNameOrType(materialData?.data, materialDataFilter);
  const onChangeSearch = (value: string) => {
    setMaterialDataFilter(value);
  };
  const onClickChoosParameter = () => {
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
      selectParameterButton?.parameter?.code, selectedShape
    );

    onClose();
  };
  const onClickNewOrder = () => {
    setIsChargeForNewDie(true);
    window.open(`/materials/${selectParameterButton?.parameter?.materialPath[0]}`, "_blank");
  };
  const onClickStraight = () => {
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
    onClose();
  };
  const fixedCartData = [
    {
      name: t("products.offsetPrice.admin.orderNewDie"),
      icon: <OrderNowIcon />,
      onclick: onClickNewOrder,
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
    const width = widthParameter && widthParameter.values && widthParameter.values.length > 0 ? +widthParameter?.values[0] : 0;
    const height = heightParameter && heightParameter.values && heightParameter.values.length > 0 ? +heightParameter?.values[0] : 0;

    const res = await callApi(
      EHttpMethod.POST,
      `/v1/calculation-service/calculations/check-option-to-straight-knife?width=${width}&length=${height}&shapeId=${shapeParameter ? shapeParameter?.parameterId : LabelShapeParameter?.parameterId}&materialTypeKey=${selectParameterButton?.parameter?.materialPath[0]}`,

    );
    if (res?.success) {
      setIsShowStraightKnife(res.data?.data?.data)
    }
  }, [widthParameter, heightParameter, shapeParameter, LabelShapeParameter, selectParameterButton]);

  return {
    materialData,
    selectedShape,
    createParameterForCalculation,
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
    setFilterValue
  };
};

export { useGalleryModal };
