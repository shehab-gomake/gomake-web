import { GomakePrimaryButton } from "@/components";
import { EButtonTypes } from "@/enums";
import { RechooseIcon } from "@/icons";
import { materialBtnDataState, subProductsParametersState } from "@/store";
import { DeleteIcon } from "@/widgets/settings-mailing/messageTemplates/components/more-circle/icons/delete";
import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
const ButtonParameterWidget = ({
  clasess,
  parameter,
  selectBtnTypeToAction,
  subSection,
  section,
  index,
  straightKnife
}) => {
  let Comp;
  const materialData = useRecoilValue<any>(materialBtnDataState);
  const [subProducts, setProducts] = useRecoilState<any>(
    subProductsParametersState
  );
  const subProductsParameters = subProducts?.find(
    (x) => x.type === subSection?.type
  )?.parameters;
  const [isSelectedShape, setIsSelectedShape] = useState<any>();
  const [selectedShape, setSelectedShape] = useState<any>();
  const [isStraightKnife, setIsStraightKnife] = useState(false);
  const isStraightKnifeInSubProducts = subProducts.some(
    (subProduct) =>
      subProduct.parameters.some(
        (parameter) => parameter.parameterId === straightKnife.id
      )
  );
  useEffect(() => {
    if (isStraightKnifeInSubProducts) {
      setIsStraightKnife(true);
      removeParameterFromSubProducts()
    } else {
      setIsStraightKnife(false);
    }

  }, [isStraightKnifeInSubProducts])
  const deleteStraightKnifeParameter = () => {
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
    setIsStraightKnife(false)
  };
  const removeParameterFromSubProducts = () => {
    if (isSelectedShape) {
      setProducts((prevSubProducts) => {
        const updatedSubProducts = prevSubProducts.map((subProduct) => {
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
        return updatedSubProducts;
      });
      setSelectedShape(null);
      setIsSelectedShape(null);
    }
  };
  useEffect(() => {
    const isSelectedShape = subProductsParameters?.find((param) => {
      return (
        param?.parameterId === parameter?.id &&
        param?.actionIndex === parameter?.actionIndex
      );
    });
    setIsSelectedShape(isSelectedShape);
  }, [subProductsParameters]);
  useEffect(() => {
    const selectedShape = materialData?.data?.find((data) => {
      return data?.id === isSelectedShape?.valueIds[0];
    });
    setSelectedShape(selectedShape);
  }, [materialData, isSelectedShape]);

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
            src={selectedShape?.rowData?.image?.value}
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
