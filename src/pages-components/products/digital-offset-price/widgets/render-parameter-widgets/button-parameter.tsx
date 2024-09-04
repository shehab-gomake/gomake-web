import { GomakePrimaryButton } from "@/components";
import { EButtonTypes } from "@/enums";
import { RechooseIcon } from "@/icons";
import { materialBtnDataState, subProductsParametersState } from "@/store";
import { DeleteIcon } from "@/widgets/settings-mailing/messageTemplates/components/more-circle/icons/delete";
import { useCallback, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import lodashClonedeep from "lodash.clonedeep";
import { useRouter } from "next/router";
import { useGomakeAxios, useSnackBar } from "@/hooks";
const ButtonParameterWidget = ({
  clasess,
  parameter,
  selectBtnTypeToAction,
  subSection,
  section,
  index,
  straightKnife,
  isParameterSettings = false,
  allMaterials
}: any) => {
  let Comp;
  const [materialData, setMaterialData] = useRecoilState<any>(materialBtnDataState);
  const router = useRouter()
  const { alertFaultAdded, alertSuccessAdded } = useSnackBar();
  const { callApi } = useGomakeAxios();
  const [subProducts, setProducts] = useRecoilState<any>(subProductsParametersState);
  const subProductsParameters = subProducts?.find((x) => x.type === subSection?.type)?.parameters;
  const [isSelectedShape, setIsSelectedShape] = useState<any>();
  const [selectedShape, setSelectedShape] = useState<any>();
  const [isStraightKnife, setIsStraightKnife] = useState(false);
  const isStraightKnifeInSubProducts = straightKnife && subProducts.some(
    (subProduct) =>
      subProduct.parameters.some(
        (parameter) => parameter.parameterId === straightKnife.id
      )
  );


  const updatedProductParameteDefaultValue = useCallback(
    async (sectionId: string, subSectionId: string, parameter: any) => {
      await updateProductParameterEndPoint(sectionId, subSectionId, {
        parameter: {
          ...parameter,
          valuesConfigs: []
        },
      });
    },

    [router]
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
    } else {
      alertFaultAdded()
    }
  };


  useEffect(() => {
    if (isStraightKnifeInSubProducts) {
      setIsStraightKnife(true);
      removeParameterFromSubProducts()
    } else {
      setIsStraightKnife(false);
    }

  }, [isStraightKnifeInSubProducts])
  const deleteStraightKnifeParameter = () => {
    if (straightKnife) {
      const updatedSubProducts = subProducts.map((subProduct) => {
        const updatedParameters = subProduct.parameters.filter(
          (parameter) => parameter.parameterId !== straightKnife.id
        );

        return {
          ...subProduct,
          parameters: updatedParameters,
        };
      });

      setProducts(updatedSubProducts);

    }
    setIsStraightKnife(false)
  };
  const removeParameterFromSubProducts = () => {
    if (isParameterSettings) {
      updatedProductParameteDefaultValue(section?.id, subSection?.id, parameter)
      setSelectedShape(null);
      setIsSelectedShape(null);
    }
    else {
      if (isSelectedShape) {
        let subProductsCopy = lodashClonedeep(subProducts);
        subProductsCopy = subProductsCopy.map((subProduct) => {
          if (subProduct.type === subSection.type) {
            const updatedParameters = subProduct.parameters.filter(
              (param) =>
                !(
                  param.parameterId === isSelectedShape.parameterId &&
                  param.actionIndex === isSelectedShape.actionIndex
                )
            );
            return { ...subProduct, parameters: updatedParameters };
          }
          return subProduct;
        });
        if (parameter.code == "DieCut") {
          const dieCutSizesParametersArray = [
            { parameterCode: "size", value: "" },
            { parameterCode: "Width", value: "" },
            { parameterCode: "Height", value: "" },
            { parameterCode: "DieUnitWidth", value: "" },
            { parameterCode: "DieUnitLength", value: "" },
            { parameterCode: "DieUnitHeight", value: "" },
          ];
          dieCutSizesParametersArray.forEach((dieCutSizesParameter) => {
            subProductsCopy = subProductsCopy.map((subProduct) => {
              if (subProduct.type === subSection.type) {
                const updatedParameters = subProduct.parameters.filter(
                  (param) =>
                    !(
                      param.parameterCode === dieCutSizesParameter.parameterCode &&
                      param.actionIndex === isSelectedShape.actionIndex
                    )
                );
                return { ...subProduct, parameters: updatedParameters };
              }
              return subProduct;
            });
          });
        }
        if (parameter.code == "DieKissCut") {
          const dieCutSizesParametersArray = [
            { parameterCode: "Width", value: "" },
            { parameterCode: "Height", value: "" },
          ];
          dieCutSizesParametersArray.forEach((dieCutSizesParameter) => {
            subProductsCopy = subProductsCopy.map((subProduct) => {
              if (subProduct.type === subSection.type) {
                const updatedParameters = subProduct.parameters.filter(
                  (param) =>
                    !(
                      param.parameterCode === dieCutSizesParameter.parameterCode &&
                      param.actionIndex === isSelectedShape.actionIndex
                    )
                );
                return { ...subProduct, parameters: updatedParameters };
              }
              return subProduct;
            });
          });
        }

        // Add the code to remove parameters with parameterCode "Width" or "Height"
        subProductsCopy = subProductsCopy.map((subProduct) => {
          if (subProduct.type === subSection.type) {
            const updatedParameters = subProduct.parameters.filter(
              (param) =>
                !(param.parameterCode === "Width" || param.parameterCode === "Height")
            );
            return { ...subProduct, parameters: updatedParameters };
          }
          return subProduct;
        });


        let sizeParameter = subSection.parameters.find(
          (param) => param.code === "size"
        );
        let isDefaultSelectedValue = sizeParameter?.valuesConfigs.find(
          (value) => value.isDefault
        );
        if (sizeParameter?.childsParameters && isDefaultSelectedValue) {

          let sizeParameterIndex = subProductsCopy.findIndex(
            (subProduct) => {
              subProduct.type === subSection.type &&
                subProduct.parameters.some((param) => param.parameterCode === "size")
            }

          );
          if (sizeParameterIndex === -1) {
            // If size parameter doesn't exist, add it
            sizeParameterIndex = subProductsCopy.findIndex(
              (subProduct) => subProduct.type === subSection.type
            );

            if (sizeParameterIndex !== -1) {
              // Clone subProduct to avoid mutating original
              const subProductClone = lodashClonedeep(subProductsCopy[sizeParameterIndex]);

              // Create size parameter object and add it to parameters
              const sizeParameterObject = {
                parameterId: sizeParameter.id,
                sectionId: section.id,
                subSectionId: subSection.id,
                ParameterType: sizeParameter.parameterType,
                values: [isDefaultSelectedValue?.updateName],
                valueIds: [isDefaultSelectedValue?.id],
                actionIndex: sizeParameter.actionIndex,
                parameterName: sizeParameter.name,
                parameterCode: sizeParameter.code,
                isDisabled: false // Assuming initial state
              };

              // Add size parameter to parameters
              subProductClone.parameters.push(sizeParameterObject);

              // Update subProductsCopy with the modified subProductClone
              subProductsCopy[sizeParameterIndex] = subProductClone;
            }
          }
          const sizeParametersToAdd = sizeParameter.childsParameters.map((myparameter) => {
            const parameterValue = isDefaultSelectedValue.values[myparameter.id];
            return {
              parameterId: myparameter.id,
              sectionId: section.id,
              subSectionId: subSection.id,
              ParameterType: myparameter.parameterType,
              values: parameterValue ? [parameterValue] : [], // Assign values if available
              actionIndex: myparameter.actionIndex,
              parameterName: myparameter.name,
              parameterCode: myparameter.code,
              isDisabled: false // Assuming initial state
            };
          });

          subProductsCopy = subProductsCopy.map((subProduct) => {
            if (subProduct.type === subSection.type) {
              const updatedParameters = [
                ...subProduct.parameters,
                ...sizeParametersToAdd
              ];
              return { ...subProduct, parameters: updatedParameters };
            }
            return subProduct;
          });
        }
        setProducts(subProductsCopy);
        setSelectedShape(null);
        setIsSelectedShape(null);
      }
    }

  };
  function transformSelectedShape(firstShape) {
    let rowData = {};

    firstShape?.additionalAttribute?.forEach(attribute => {
      rowData[attribute.valueId] = {
        value: attribute.value,
        isEditable: true,
        type: 0,
        values: []
      };

      if (attribute.valueId === "image") {
        rowData[attribute.valueId].type = 7;
      }
    });

    return {
      id: firstShape?.valueId,
      stock: 1,
      isActive: true,
      code: null,
      category: "Folders",
      rowData: {
        ...rowData,
        currency: {
          value: firstShape?.currency,
          isEditable: true,
          type: 5
        },
        stock: {
          value: 1,
          isEditable: true,
          type: 1
        },
        Active: {
          value: true,
          isEditable: true,
          type: 2
        }
      }
    };
  }
  useEffect(() => {
    if (isParameterSettings) {
      const isSelectedShape = parameter?.valuesConfigs && parameter.valuesConfigs?.length > 0
      if (isSelectedShape) {
        setIsSelectedShape(parameter?.valuesConfigs)
      }
    }
    else {

      const isSelectedShape = subProductsParameters?.find((param) => {
        return (
          param?.parameterId === parameter?.id &&
          param?.actionIndex === parameter?.actionIndex
        );
      });
      if (isSelectedShape) {
        setIsSelectedShape(isSelectedShape);
      }
    }

  }, [subProductsParameters, isParameterSettings, parameter]);
  useEffect(() => {
    if (isParameterSettings && isSelectedShape) {
      const selectedShape = materialData?.data?.find((data) => {
        return data?.id === isSelectedShape[0]?.id;
      });
      setSelectedShape(selectedShape);
    } else {
      const selectedShape = materialData?.data?.find((data) => {
        return data?.id === isSelectedShape?.valueIds[0];
      });
      setSelectedShape(selectedShape);
    }

  }, [materialData, isSelectedShape, isParameterSettings]);
  useEffect(() => {
    if (materialData?.length > 0 || !isSelectedShape) return;

    const materialPath = parameter?.materialPath?.[0];
    const materialDataPath = allMaterials?.find((material) => material?.pathName === materialPath)?.data;

    if (!materialDataPath) return;

    const selectedShapeId = isParameterSettings ? isSelectedShape?.[0]?.id : isSelectedShape?.valueIds?.[0];
    const selectedMaterial = materialDataPath?.find((material) => material.valueId === selectedShapeId);
    const transformedShape: any = transformSelectedShape(selectedMaterial);

    if (!transformedShape) return;

    setSelectedShape(transformedShape);

    if (!parameter?.isHidden && !isParameterSettings && subProductsParameters?.length > 0) {
      const dieUnitWidth = parameter?.code === "DieKissCut"
        ? transformedShape?.rowData?.unitWidth?.value
        : transformedShape?.rowData?.width?.value;
      const dieUnitLength = parameter?.code === "DieKissCut"
        ? transformedShape?.rowData?.unitLength?.value
        : transformedShape?.rowData?.length?.value;

      const dieCutSizesParametersArray = [
        { parameterCode: "Width", value: dieUnitWidth?.toString() },
        { parameterCode: "Height", value: dieUnitLength?.toString() },
      ];

      let updatedParameters = subProductsParameters.map((param) => {
        const matchingParam = dieCutSizesParametersArray.find((dieParam) => dieParam.parameterCode === param.parameterCode);
        return matchingParam ? { ...param, values: [matchingParam.value], isDisabled: true } : param;
      });

      dieCutSizesParametersArray.forEach((dieParam) => {
        const subSectionParam = subSection.parameters.find((param) => param.code === dieParam.parameterCode);
        if (!updatedParameters.find((p) => p.parameterCode === dieParam.parameterCode) && subSectionParam) {
          updatedParameters.push({
            parameterId: subSectionParam.id,
            sectionId: section?.id,
            subSectionId: subSection?.id,
            ParameterType: parameter?.ParameterType,
            parameterName: parameter?.name,
            actionId: parameter?.actionId,
            values: [dieParam.value],
            valueIds: [],
            actionIndex: subSectionParam.actionIndex,
            parameterCode: subSectionParam.code,
            valuesConfigs: subSectionParam?.valuesConfigs,
            unitKey: subSectionParam?.unitKey,
            unitType: subSectionParam?.unitType,
            isDisabled: true,
          });
        }
      });

      const sizeParameter = subSection.parameters.find((param) => param.code === "size");
      if (sizeParameter) {
        const customValue = sizeParameter.valuesConfigs.find((config) => !config.values || Object.keys(config.values).length === 0);
        if (customValue) {
          const existingSizeParam = updatedParameters.find((param) => param.parameterCode === "size");
          if (existingSizeParam) {
            const updatedSizeParam = {
              ...existingSizeParam,
              valueIds: [customValue.id],
              values: [customValue.updateName],
              isDisabled: true,
            };
            updatedParameters = updatedParameters.map(param =>
              param.parameterCode === existingSizeParam.parameterCode ? updatedSizeParam : param
            );
          } else {
            updatedParameters.push({
              parameterId: sizeParameter.id,
              sectionId: section?.id,
              subSectionId: subSection?.id,
              ParameterType: sizeParameter.parameterType,
              parameterName: sizeParameter.name,
              actionId: sizeParameter.actionId,
              values: [customValue.updateName],
              valueIds: [customValue.id],
              actionIndex: sizeParameter.actionIndex,
              parameterCode: sizeParameter.code,
              valuesConfigs: sizeParameter?.valuesConfigs,
              unitKey: sizeParameter?.unitKey,
              unitType: sizeParameter?.unitType,
              isDisabled: true,
            });
          }
        }
      }

      const updatedSubProducts = subProducts.map((subProduct) =>
        subProduct.type === subSection?.type
          ? { ...subProduct, parameters: updatedParameters }
          : subProduct
      );

      setProducts(updatedSubProducts);
    }
  }, [materialData, isParameterSettings, isSelectedShape, allMaterials]);


  if (parameter?.buttonAction === EButtonTypes.GALLERY_MODAL) {
    if (isStraightKnife) {
      Comp = (
        <div style={clasess.btnSelectedStyle}>
          <div style={clasess.btnSelectedTextStyle}>
            {straightKnife?.name}
          </div>
          <div
            style={clasess.btnSelectedIconReChoose}
            onClick={() => {
              selectBtnTypeToAction(
                parameter,
                section?.id,
                subSection?.id,
                index,
                subSection?.type
              )
              deleteStraightKnifeParameter()
              setIsStraightKnife(false)
            }


            }
          >
            <RechooseIcon />
          </div>
          <div
            style={clasess.btnSelectedIconReChoose}
            onClick={deleteStraightKnifeParameter}
          >
            <DeleteIcon />
          </div>
        </div>
      );
    }
    else if (isSelectedShape && selectedShape) {
      Comp = (
        <div style={clasess.btnSelectedStyle}>
          <img
            src={selectedShape?.rowData?.image?.value || selectedShape?.additionalAttribute}
            style={{ width: 24, height: 24 }}
          />
          <div style={clasess.btnSelectedTextStyle}>
            {selectedShape?.rowData?.name?.value}
          </div>
          <div
            style={clasess.btnSelectedIconReChoose}
            onClick={() =>
              selectBtnTypeToAction(
                parameter,
                section?.id,
                subSection?.id,
                index,
                subSection?.type
              )
            }
          >
            <RechooseIcon />
          </div>
          <div
            style={clasess.btnSelectedIconReChoose}
            onClick={removeParameterFromSubProducts}
          >
            <DeleteIcon />
          </div>
        </div>
      );
    } else {
      Comp = (
        <GomakePrimaryButton
          style={clasess.dynamicBtn}
          onClick={() =>
            selectBtnTypeToAction(
              parameter,
              section?.id,
              subSection?.id,
              index,
              subSection?.type
            )
          }
        >
          {parameter?.name}
        </GomakePrimaryButton>
      );
    }
  } else {
    Comp = (
      <GomakePrimaryButton
        style={clasess.dynamicBtn}
        onClick={() =>
          selectBtnTypeToAction(
            parameter,
            section?.id,
            subSection?.id,
            index,
            subSection?.type
          )
        }
      >
        {parameter?.name}
      </GomakePrimaryButton>
    );
  }

  return <>{Comp}</>;
};

export { ButtonParameterWidget };
