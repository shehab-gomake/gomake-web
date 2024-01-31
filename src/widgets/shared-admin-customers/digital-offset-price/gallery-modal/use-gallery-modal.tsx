import { useCallback, useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";

import { materialBtnDataState, selectParameterButtonState, subProductsParametersState } from "@/store";
import { getPrintHouseMaterialsByMaterialKey } from "@/services/hooks";
import { materialsCategoriesState } from "@/store/material-categories";
import { compareStrings, getParameterByParameterCode } from "@/utils/constants";
import { useGomakeAxios } from "@/hooks";
import { selectedShapeState } from "./gallery-modal-store";
import { StaightKnifeIcon, OrderNowIcon } from "./icons";
import { useTranslation } from "react-i18next";
import { EHttpMethod } from "@/services/api-service/enums";

const useGalleryModal = ({ onClose, onChangeSubProductsForPrice, setIsChargeForNewDie, straightKnife }) => {

  const { callApi } = useGomakeAxios();
  const { t } = useTranslation();
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
  const widthParameter = getParameterByParameterCode(
    subProducts,
    "Width"
  );
  const heightParameter = getParameterByParameterCode(
    subProducts,
    "Height"
  );
  const shapeParameter = getParameterByParameterCode(subProducts, "Shape")

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
    await getPrintHouseMaterialsByMaterialKey(callApi, setMaterialData, {
      key: selectParameterButton?.parameter?.materialPath[0],
    });
  }, [selectParameterButton]);

  const createParameterForCalculation = (parameter) => {
    setSelectedShape(parameter);
  };
  function searchByName(items, searchText) {
    searchText = searchText.toLowerCase();
    const result = items?.filter((item) =>
      item.rowData.name.value.toLowerCase().includes(searchText)
    );
    return result;
  }
  const searchResult = searchByName(materialData?.data, materialDataFilter);
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
      selectParameterButton?.parameter?.code,

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
    const res = await callApi(
      EHttpMethod.POST,
      `/v1/calculation-service/calculations/check-option-to-straight-knife?width=${+widthParameter?.values[0]}&length=${+heightParameter?.values[0]}&shapeId=${shapeParameter?.parameterId}`,

    );
    if (res?.success) {
      setIsShowStraightKnife(res.data?.data?.data)
    } else {
      // alertFaultAdded();
    }
  }, [widthParameter, heightParameter, shapeParameter]);

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
  };
};

export { useGalleryModal };
