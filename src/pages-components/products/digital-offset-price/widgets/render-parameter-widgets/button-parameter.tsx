import { GomakePrimaryButton } from "@/components";
import { EButtonTypes } from "@/enums";
import { RechooseIcon } from "@/icons";

const ButtonParameterWidget = ({
  clasess,
  parameter,
  selectBtnTypeToAction,
  subSection,
  section,
  selectedShape,
}) => {
  let Comp;

  if (parameter?.buttonAction === EButtonTypes.GALLERY_MODAL) {
    if (selectedShape?.id?.length > 0 && selectedShape) {
      Comp = (
        <div style={clasess.btnSelectedStyle}>
          <img
            src={selectedShape?.rowData?.image?.value}
            style={{ width: 24, height: 24 }}
          />
          <div style={clasess.btnSelectedTextStyle}>
            {selectedShape?.rowData?.name?.value}
          </div>
          <div style={clasess.btnSelectedIconReChoose}>
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
