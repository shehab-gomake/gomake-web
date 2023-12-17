import { GomakePrimaryButton } from "@/components";
import { EButtonTypes } from "@/enums";
import { RechooseIcon } from "@/icons";
import { materialBtnDataState, subProductsParametersState } from "@/store";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
const ButtonParameterWidget = ({
  clasess,
  parameter,
  selectBtnTypeToAction,
  subSection,
  section,
  index,
}) => {
  let Comp;
  const materialData = useRecoilValue<any>(materialBtnDataState);
  const subProducts = useRecoilValue<any>(subProductsParametersState);
  const subProductsParameters = subProducts?.find(
    (x) => x.type === subSection?.type
  )?.parameters;
  const [isSelectedShape, setIsSelectedShape] = useState<any>();
  const [selectedShape, setSelectedShape] = useState<any>();
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
    if (isSelectedShape && selectedShape) {
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
