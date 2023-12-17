import { useCallback, useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";

import { materialBtnDataState, selectParameterButtonState } from "@/store";
import { getPrintHouseMaterialsByMaterialKey } from "@/services/hooks";
import { materialsCategoriesState } from "@/store/material-categories";
import { compareStrings } from "@/utils/constants";
import { useGomakeAxios } from "@/hooks";
import { selectedShapeState } from "./gallery-modal-store";

const useGalleryModal = ({ onClose, onChangeSubProductsForPrice }) => {
  const { callApi } = useGomakeAxios();
  const selectParameterButton = useRecoilValue<any>(selectParameterButtonState);
  console.log("selectParameterButton", selectParameterButton);
  const materialsEnumsValues = useRecoilValue(materialsCategoriesState);
  const [selectedShape, setSelectedShape] =
    useRecoilState<any>(selectedShapeState);
  const [materialData, setMaterialData] =
    useRecoilState<any>(materialBtnDataState);
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
  return {
    materialData,
    selectedShape,
    createParameterForCalculation,
    onClickChoosParameter,
  };
};

export { useGalleryModal };
