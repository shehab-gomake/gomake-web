import { useCallback, useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";

import { generalParametersState, selectParameterButtonState } from "@/store";
import { getPrintHouseMaterialsByMaterialKey } from "@/services/hooks";
import { materialsCategoriesState } from "@/store/material-categories";
import { compareStrings } from "@/utils/constants";
import { useGomakeAxios } from "@/hooks";

const useGalleryModal = ({ onClose }) => {
  const { callApi } = useGomakeAxios();
  const [generalParameters, setGeneralParameters] = useRecoilState<any>(
    generalParametersState
  );
  const selectParameterButton = useRecoilValue<any>(selectParameterButtonState);
  const materialsEnumsValues = useRecoilValue(materialsCategoriesState);
  const [selectedShape, setSelectedShape] = useState<any>();
  const [materialData, setMaterialData] = useState<any>([]);
  const [materialType, setMaterialType] = useState<any>({});
  const [materialParameter, setMaterialParameter] = useState({});

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
    setMaterialParameter({
      parameterId: selectParameterButton?.parameter?.id,
      actionId: selectParameterButton?.parameter?.actionId,
      actionIndex: selectParameterButton?.parameter?.actionIndex,
      ParameterType: selectParameterButton?.parameter?.parameterType,
      parameterName: selectParameterButton?.parameter?.name,
      valueIds: [selectedShape?.id],
      sectionId: selectParameterButton?.sectionId,
      subSectionId: selectParameterButton?.subSectionId,
      material: materialType?.id,
      values: [],
    });
  }, [selectParameterButton, selectedShape]);

  const getProductQuoteItemById = useCallback(async () => {
    await getPrintHouseMaterialsByMaterialKey(callApi, setMaterialData, {
      key: selectParameterButton?.parameter?.materialPath[0],
    });
  }, [selectParameterButton]);

  const createParameterForCalculation = (parameter) => {
    setSelectedShape(parameter);
  };

  const onClickChoosParameter = () => {
    let temp = [...generalParameters];
    setGeneralParameters([...temp, materialParameter]);
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
