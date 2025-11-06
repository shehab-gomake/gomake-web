import { useState } from "react";
import { UpdateValueInput } from "@/components/text-input/update-value-input";
import { Stack } from "@mui/material";
import { useStyle } from "@/widgets/materials-widget/style";
import { DotsLoader } from "@/components/dots-loader/dots-Loader";
import { PrimaryButton } from "@/components/button/primary-button";

interface InventoryPriceInputProps {
  value: number | number[] | string[]; // Can be single number or array
  isEditable: boolean;
  onUpdate: (newValue: number, index?: number) => Promise<void>;
  isLoading?: boolean;
}

const InventoryPriceInput: React.FC<InventoryPriceInputProps> = ({
  value,
  isEditable,
  onUpdate,
  isLoading = false,
}) => {
  const { classes } = useStyle();
  const [isUpdate, setIsUpdate] = useState<number | null>(null);
  const [updateValue, setUpdateValue] = useState<string>("");

  // Normalize value to array format
  const valueArray = Array.isArray(value)
    ? value.map(v => typeof v === 'string' ? v : v?.toString() || "0")
    : [value?.toString() || "0"];

  const onClick = (index: number) => {
    if (isEditable) {
      setIsUpdate(index);
      setUpdateValue(valueArray[index]);
    }
  };

  const handleInputChange = (v: string) => {
    setUpdateValue(v);
  };

  const handleUpdate = async (index: number) => {
    const numValue = Number(updateValue) || 0;
    if (updateValue !== valueArray[index]) {
      await onUpdate(numValue, index);
    }
    setIsUpdate(null);
  };

  const handleCancel = () => {
    setIsUpdate(null);
    setUpdateValue("");
  };

  const handleClickOutside = (index: number) => {
    handleUpdate(index);
  };

  return (
    <Stack
      direction="row"
      spacing={1}
      alignItems="center"
      justifyContent="center"
      gap="2px"
    >
      {isLoading ? (
        <DotsLoader />
      ) : (
        valueArray?.flatMap((val, index, array) => {
          if (index < array.length - 1) {
            return [
              isUpdate === index ? (
                <UpdateValueInput
                  key={`input-${index}`}
                  value={updateValue}
                  onInputChange={handleInputChange}
                  onUpdate={() => handleUpdate(index)}
                  onCancel={handleCancel}
                  clickedOut={() => handleClickOutside(index)}
                // style={classes.updateInputStyle}
                />
              ) : (
                <PrimaryButton
                  key={`button-${index}`}
                  sx={classes.clickableData}
                  onClick={() => onClick(index)}
                  variant="text"
                  style={{ minWidth: "max-content" }}
                  disabled={!isEditable}
                >
                  {val}
                </PrimaryButton>
              ),
              <span key={`separator-${index}`}>/</span>,
            ];
          } else {
            return [
              isUpdate === index ? (
                <UpdateValueInput
                  key={`input-${index}`}
                  value={updateValue}
                  onInputChange={handleInputChange}
                  onUpdate={() => handleUpdate(index)}
                  onCancel={handleCancel}
                  clickedOut={() => handleClickOutside(index)}
                // style={classes.updateInputStyle}
                />
              ) : (
                <PrimaryButton
                  key={`button-${index}`}
                  sx={classes.clickableData}
                  onClick={() => onClick(index)}
                  variant="text"
                  style={{ minWidth: "max-content" }}
                  disabled={!isEditable}
                >
                  {val}
                </PrimaryButton>
              ),
            ];
          }
        })
      )}
    </Stack>
  );
};

export { InventoryPriceInput };

