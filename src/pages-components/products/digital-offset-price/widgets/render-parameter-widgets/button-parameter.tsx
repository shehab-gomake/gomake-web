import { GomakePrimaryButton } from "@/components";
import { EButtonTypes } from "@/enums";
import { RechooseIcon } from "@/icons";
import { generalParametersState, materialBtnDataState } from "@/store";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
const ButtonParameterWidget = ({
  clasess,
  parameter,
  selectBtnTypeToAction,
  subSection,
  section,
}) => {
  let Comp;
  const materialData = useRecoilValue<any>(materialBtnDataState);
  const generalParameters = useRecoilValue<any>(generalParametersState);
  const [isSelectedShape, setIsSelectedShape] = useState<any>();
  const [selectedShape, setSelectedShape] = useState<any>();
  useEffect(() => {
    const isSelectedShape = generalParameters.find((param) => {
      return (
        param?.parameterId === parameter?.id &&
        param?.actionIndex === parameter?.actionIndex
      );
    });
    setIsSelectedShape(isSelectedShape);
  }, [generalParameters]);
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
              selectBtnTypeToAction(parameter, section?.id, subSection?.id)
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
            selectBtnTypeToAction(parameter, section?.id, subSection?.id)
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
          selectBtnTypeToAction(parameter, section?.id, subSection?.id)
        }
      >
        {parameter?.name}
      </GomakePrimaryButton>
    );
  }

  return <>{Comp}</>;
};

export { ButtonParameterWidget };
