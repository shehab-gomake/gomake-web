import { useCallback, useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";

import { materialBtnDataState, selectParameterButtonState } from "@/store";
import { getPrintHouseMaterialsByMaterialKey } from "@/services/hooks";
import { materialsCategoriesState } from "@/store/material-categories";
import { compareStrings } from "@/utils/constants";
import { useGomakeAxios, useGomakeRouter } from "@/hooks";
import { selectedShapeState } from "./gallery-modal-store";
import { StaightKnifeIcon, AddNewIcon, OrderNowIcon } from "./icons";
import { useTranslation } from "react-i18next";

const useGalleryModal = ({ onClose, onChangeSubProductsForPrice }) => {
  const { callApi } = useGomakeAxios();
  const { t } = useTranslation();
  const selectParameterButton = useRecoilValue<any>(selectParameterButtonState);
  const materialsEnumsValues = useRecoilValue(materialsCategoriesState);
  const [selectedShape, setSelectedShape] =
    useRecoilState<any>(selectedShapeState);
  const [materialData, setMaterialData] =
    useRecoilState<any>(materialBtnDataState);
  const [materialDataFilter, setMaterialDataFilter] = useState("");
  const [materialType, setMaterialType] = useState<any>({});
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
  const { navigate } = useGomakeRouter();
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
      selectParameterButton?.parameter?.actionIndex
    );

    onClose();
  };
  const onClickNewOrder = () => {
    navigate(`/materials/${selectParameterButton?.parameter?.materialPath[0]}`);
  };
  const onClickAddExisting = () => {
    navigate(`/materials/${selectParameterButton?.parameter?.materialPath[0]}`);
  };
  const onClickStraight = () => {
    console.log("Straight knife");
  };
  const fixedCartData = [
    {
      name: t("products.offsetPrice.admin.orderNewDie"),
      icon: <OrderNowIcon />,
      onclick: onClickNewOrder,
      backgroundColor: "#504FA1",
    },
    {
      name: t("products.offsetPrice.admin.AddExistingDie"),
      icon: <AddNewIcon />,
      onclick: onClickAddExisting,
      backgroundColor: "#8283BE",
    },
    {
      name: t("products.offsetPrice.admin.straightKnife"),
      icon: <StaightKnifeIcon />,
      onclick: onClickStraight,
      backgroundColor: "#F467BA",
    },
  ];
  const [renderData, setRenderData] = useState([]);
  useEffect(() => {
    const renderData = materialDataFilter ? searchResult : materialData;
    setRenderData(renderData);
  }, [materialDataFilter]);
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
