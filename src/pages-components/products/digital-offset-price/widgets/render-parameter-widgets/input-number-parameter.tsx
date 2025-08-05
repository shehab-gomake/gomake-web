import { GomakeTextInput } from "@/components";
import { EWidgetProductType } from "../../enums";
import { useRecoilState, useRecoilValue } from "recoil";
import { openQuantityComponentModalState } from "./quantity-parameter/quantity-types/state";
import { productSetsParamState, productTypesNumberState } from "@/store";
import { IconButton } from "@mui/material";
import { SettingsIcon } from "@/icons/settings";

const InputNumberParameterWidget = ({
  clasess,
  parameter,
  index,
  temp,
  onChangeSubProductsForPrice,
  subSection,
  section,
  type,
  disabled = false,
  extraOnChange,
  widgetType,
  setIsJobNameValue
}: any) => {
  const myParameter = temp.find((item) => item.parameterId === parameter.id && item?.actionIndex === parameter.actionIndex)
  const [openModal, setOpenModal] = useRecoilState<boolean>(openQuantityComponentModalState);
  const productTypesNumber = useRecoilValue<number>(productTypesNumberState);
  const productSetsParam = useRecoilValue<string>(productSetsParamState);
  const checkIfNotHaveValue = () => {
    try {
      return !temp[index]?.values || temp[index]?.values.every(value => value === undefined);
    } catch (error) {
      return false;
    }
  }
  return (
    <div data-tour={parameter?.id?.toString()} style={{ display: "flex", flexDirection: "row", width: "100%" }}>
      <GomakeTextInput
        style={parameter?.isRequired && checkIfNotHaveValue() ? clasess.requiredTextInputStyle : clasess.textInputStyle}
        disabled={parameter?.isLock ? parameter?.isLock : disabled ? disabled : myParameter?.isDisabled}
        defaultValue={parameter.defaultValue}
        placeholder={parameter.name}
        value={index !== -1 ? temp[index].values : ""}
        onChange={(e: any, item: any) => {
          if (parameter?.code === "JobName" && widgetType === EWidgetProductType.EDIT) {
            setIsJobNameValue(true)
          }
          else {
            setIsJobNameValue(false)
          }
          onChangeSubProductsForPrice(
            parameter?.id,
            subSection?.id,
            section?.id,
            parameter?.parameterType,
            parameter?.name,
            parameter?.actionId,
            { values: e.target.value },
            subSection?.type,
            index,
            parameter?.actionIndex,
            parameter?.code
          );
          extraOnChange && e?.target.value > 1 && extraOnChange()
        }}
        type={type}
        InputProps={{ inputProps: { min: type === "number" ? 0 : undefined } }}
      />
      {productTypesNumber > 1 && productSetsParam != "true" && parameter?.code == "quantity" && (
        <IconButton
          onClick={() => {
            setOpenModal(true);
          }}
        >
          <SettingsIcon
            stroke={"rgba(237, 2, 140, 1)"}
            width={24}
            height={24}
          />
        </IconButton>
      )}
    </div>
  );
};

export { InputNumberParameterWidget };
