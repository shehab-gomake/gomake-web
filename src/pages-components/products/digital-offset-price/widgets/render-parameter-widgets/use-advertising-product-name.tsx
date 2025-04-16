import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { useTranslation } from "react-i18next";

import { useGomakeAxios, useSnackBar } from "@/hooks";
import { subProductsParametersState } from "@/store/general-parameters-state";
import { addPrintHouseMaterialCategoryApi } from "@/services/api-service/materials/printhouse-materials-endpoints";
import { createDieCutFromTemplateMakerApi } from "@/services/api-service/materials/materials-endpoints";

const useAdvertisingProductName = ({ parameter }) => {
  const { t } = useTranslation();
  const { callApi } = useGomakeAxios();
  const { alertSuccessAdded, alertFaultAdded, alertFault } = useSnackBar();
  const [subProducts, setSubProducts] = useRecoilState<any>(subProductsParametersState);
  const category = subProducts.flatMap((item: any) => item.parameters).find((param: any) => param.parameterCode === "DiecutType")?.values[0];

  const [openModal, setOpenModal] = useState(false);
  const [searchResult, setSearchResult] = useState([]);
  const defaultObject = parameter.valuesConfigs.find(
    (item) => item.isDefault === true
  );
  const [newCategory, setNewCategory] = useState("");
  const onAddCategory = async () => {
    const callBack = (res) => {
      if (res.success) {
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
      "SheetWeight",
      "Sheetcategory",
      "SheetColor",
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
  const createNewTemplateEndPoint = async () => {
    const unitWidth = subProducts.flatMap((item: any) => item.parameters).find((param: any) => param.parameterCode === "DieUnitWidth")?.values[0];
    const unitLength = subProducts.flatMap((item: any) => item.parameters).find((param: any) => param.parameterCode === "DieUnitLength")?.values[0];
    const unitHeight = subProducts.flatMap((item: any) => item.parameters).find((param: any) => param.parameterCode === "DieUnitHeight")?.values[0];
    const sheetWeight = subProducts.flatMap((item: any) => item.parameters).find((param: any) => param.parameterCode === "SheetWeight")?.values[0];
    const sheetcategory = subProducts.flatMap((item: any) => item.parameters).find((param: any) => param.parameterCode === "Sheetcategory")?.values[0];
    const sheetColor = subProducts.flatMap((item: any) => item.parameters).find((param: any) => param.parameterCode === "SheetColor")?.values[0];
    const reqObj = {

      dieCutCategory: category,
      unitWidth: Number(unitWidth),
      unitLength: Number(unitLength),
      unitHeight: Number(unitHeight),
      sheetsWeight: sheetWeight,
      sheetsCategory: sheetcategory,
      sheetsColor: sheetColor
    }
    const callBack = (res) => {
      if (res.success && res.data && res.data.data) {
        setSearchResult((prev: any) => {
          return [res.data.data, ...prev,] // Add the new item to the data list
        });

        const pdfUrl = res.data.pdfUrl;
        if (pdfUrl) {
          window.open(pdfUrl, '_blank');
        }
      } else {
        alertFault(t("products.offsetPrice.admin.errorAddingTemplate"))
      }
    };
    await createDieCutFromTemplateMakerApi(callApi, callBack, reqObj);
  }

  const createNewTemplate = () => {
    const result = checkRequiredParameters(subProducts);
    if (result) {
      createNewTemplateEndPoint()
    } else {
      const errorMessage = t("products.offsetPrice.admin.errorMakerTemplate1")
      alertFault(errorMessage)
    }
  }
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
    category
  };
};

export { useAdvertisingProductName };
