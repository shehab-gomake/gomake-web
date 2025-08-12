import { GomakePrimaryButton } from "@/components";
import { EButtonTypes } from "@/enums";
import { ReChooseIcon } from "@/icons";
import { materialBtnDataState, subProductsParametersState } from "@/store";
import { DeleteIcon } from "@/widgets/settings-mailing/messageTemplates/components/more-circle/icons/delete";
import { useCallback, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import lodashClonedeep from "lodash.clonedeep";
import { useRouter } from "next/router";
import { useGomakeAxios, useSnackBar } from "@/hooks";
import { checkIfDieCutOrDieKissCutExists, findParameterByCode } from "@/utils/helpers";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
const ButtonParameterWidget = ({
  clasess,
  parameter,
  selectBtnTypeToAction,
  subSection,
  section,
  index,
  straightKnife,
  isParameterSettings = false,
  allMaterials,
  template,
  getProductById,
  isCreate
}: any) => {
  let Comp;
  const [materialData, setMaterialData] = useRecoilState<any>(materialBtnDataState);
  const router = useRouter()
  const { alertFaultAdded, alertSuccessAdded } = useSnackBar();
  const { callApi } = useGomakeAxios();
  const { secondColor, } = useGomakeTheme();
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
  const dieCutParameterForSettings = findParameterByCode(template, "DieCut")
  const dieKissCutParameterForSettings = findParameterByCode(template, "DieKissCut")

  const isDiesParameter = dieCutParameterForSettings || dieKissCutParameterForSettings
  const updatedProductParameteDefaultValue = useCallback(
    async (sectionId: string, subSectionId: string, parameter: any) => {
      const updatedValuesConfigs = isDiesParameter.valuesConfigs.map((config: any) => ({
        ...config,
        isDefault: false,
      }));

      await updateProductParameterEndPoint(sectionId, subSectionId, {
        parameter: {
          ...parameter,
          valuesConfigs: updatedValuesConfigs,
        },
      });
    },
    [router, isDiesParameter]
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
        else if (parameter.code == "DieKissCut") {
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
        else if (parameter.code == "DieStamp") {
          const dieStampSizesParametersArray = [
            { parameterCode: "EnhancementLength", value: "" },
            { parameterCode: "EnhancementWidth", value: "" },
          ];
          dieStampSizesParametersArray.forEach((dieStampSizesParameter) => {
            subProductsCopy = subProductsCopy.map((subProduct) => {
              console.log("subProduct", { subProduct, subSection })
              console.log("isSelectedShapisSelectedShapee", isSelectedShape)
              if (subProduct.type === subSection.type) {
                const updatedParameters = subProduct.parameters.filter(
                  (param) =>
                    !(
                      param.parameterCode === dieStampSizesParameter.parameterCode &&
                      param.actionIndex === isSelectedShape.actionIndex
                    )
                );

                return { ...subProduct, parameters: updatedParameters };
              }

              return subProduct;
            });
          });
        }
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


        // Add the code to remove parameters with parameterCode "Width" or "Height"

        setProducts(subProductsCopy);
        setSelectedShape(null);
        setIsSelectedShape(null);
      }
    }

  };
  function transformSelectedShape(firstShape) {
    if (!firstShape) return;
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
    if (isParameterSettings) {
      const selectedShape = materialData?.data?.find((data) => {
        const myDefaultShape = isSelectedShape?.find((config) => config?.isDefault)
        return data?.id === myDefaultShape?.id;
      });
      if (selectedShape) {
        setSelectedShape(selectedShape);

      }
    } else {
      const selectedShape = materialData?.data?.find((data) => {
        return data?.id === isSelectedShape?.valueIds[0];
      });
      if (selectedShape) {
        setSelectedShape(selectedShape);
      }
    }

  }, [materialData, isSelectedShape, isParameterSettings]);
  useEffect(() => {
    if (!isCreate) {
      const materialPath = parameter?.materialPath?.[0];
      const materialDataPath = allMaterials?.find((material) => material?.pathName === materialPath)?.data;

      if (!materialDataPath) return;

      // Create a new list containing just the data arrays from all objects
      const allDataList = materialDataPath.reduce((acc, curr) => {
        if (curr.data && curr.data.length > 0) {
          acc.push(...curr.data);
        }
        return acc;
      }, []);
      const selectedShapeIdWhenEdit = allDataList.find((data) => data.valueId === isSelectedShape?.valueIds?.[0]);
      const selectedShapeId = isParameterSettings ? isSelectedShape?.find((config) => config?.isDefault)?.id : selectedShapeIdWhenEdit ?? isSelectedShape?.valueIds?.[0];
      const selectedMaterial = materialDataPath?.find((material) => material.valueId === selectedShapeId);
      const transformedShape: any = transformSelectedShape(selectedMaterial);
      if (transformedShape) {
        setSelectedShape(transformedShape);
      }
      else if (selectedShapeIdWhenEdit) {
        setSelectedShape(selectedShapeIdWhenEdit);
      }
      else {
        setSelectedShape(null);
      }
    }

  }, [materialData, isParameterSettings, isSelectedShape, allMaterials]);
  const hasDieCutOrDieKissCut = checkIfDieCutOrDieKissCutExists(subProducts, isParameterSettings);
  const [selectedConfigValues, setSelectedConfigValues] = useState<any>({});
  if (parameter?.buttonAction === EButtonTypes.GALLERY_MODAL) {
    if (isStraightKnife) {
      Comp = (
        <div style={clasess?.btnSelectedStyle}>
          <div style={clasess?.btnSelectedTextStyle}>
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
                subSection?.type,
                parameter?.actionIndex
              )
              deleteStraightKnifeParameter()
              setIsStraightKnife(false)
            }


            }
          >
            <ReChooseIcon />
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

    else if ((isSelectedShape || selectedShape) && hasDieCutOrDieKissCut) {
      let configData = selectedShape;

      if (!selectedShape && isSelectedShape) {
        const selectedValues = isSelectedShape.values;
        const selectedValueIds = isSelectedShape.valueIds;

        const selectedConfig = isSelectedShape?.valuesConfigs?.find(config => {
          const nameAttribute = config.additionalAttribute?.find(attr => attr.valueId === "name");
          return nameAttribute && selectedValues.includes(nameAttribute.value);
        })

        if (selectedConfig) {
          configData = selectedConfig;
          const nameAttr = selectedConfig.additionalAttribute.find(attr => attr.valueId === "name");
          const imageAttr = selectedConfig.additionalAttribute.find(attr => attr.valueId === "image");
          setSelectedConfigValues({
            image: imageAttr?.value,
            name: nameAttr?.value,
            values: selectedValues,
            valueIds: selectedValueIds
          })
        }
      }

      // Simplified image and name extraction
      const image = configData?.rowData?.image?.value ||
        configData?.additionalAttribute?.find(attr => attr.valueId === "image")?.value ||
        isSelectedShape?.valuesConfigs?.[0]?.additionalAttribute?.find(attr => attr.valueId === "image")?.value ||
        selectedConfigValues?.image

      const name = configData?.rowData?.name?.value ||
        configData?.additionalAttribute?.find(attr => attr.valueId === "name")?.value ||
        isSelectedShape?.values?.[0] ||
        selectedConfigValues?.name

      Comp = (
        <div style={clasess?.btnSelectedStyle}>
          <img
            src={image}
            style={{ width: 24, height: 24 }}
            alt={name}
          />
          <div style={clasess?.btnSelectedTextStyle}>
            {name}
          </div>
          <div
            style={clasess?.btnSelectedIconReChoose}
            onClick={() =>
              selectBtnTypeToAction(
                parameter,
                section?.id,
                subSection?.id,
                index,
                subSection?.type,
                parameter?.actionIndex
              )
            }
          >
            <ReChooseIcon />
          </div>
          <div
            style={clasess?.btnSelectedIconReChoose}
            onClick={removeParameterFromSubProducts}
          >
            <DeleteIcon />
          </div>
        </div>
      );
    } else {
      Comp = (
        <GomakePrimaryButton
          // style={clasess.dynamicBtn}
          style={{
            height: 40,
            backgroundColor: "white",
            border: `1px solid ${secondColor(500)}`,
            color: secondColor(500),
          }}
          onClick={() =>
            selectBtnTypeToAction(
              parameter,
              section?.id,
              subSection?.id,
              index,
              subSection?.type,
              parameter?.actionIndex
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
        // style={clasess.dynamicBtn}
        style={{
          height: 40,
          backgroundColor: "white",
          border: `1px solid ${secondColor(500)}`,
          color: secondColor(500),
        }}
        onClick={() =>
          selectBtnTypeToAction(
            parameter,
            section?.id,
            subSection?.id,
            index,
            subSection?.type,
            parameter?.actionIndex
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
