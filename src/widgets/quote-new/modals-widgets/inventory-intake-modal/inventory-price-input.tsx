import { useState } from "react";
import { UpdateValueInput } from "@/components/text-input/update-value-input";
import { Stack } from "@mui/material";
import { useStyle } from "@/widgets/materials-widget/style";
import { DotsLoader } from "@/components/dots-loader/dots-Loader";

interface InventoryPriceInputProps {
  value: number;
  isEditable: boolean;
  onUpdate: (newValue: number) => Promise<void>;
  isLoading?: boolean;
}

const InventoryPriceInput: React.FC<InventoryPriceInputProps> = ({
  value,
  isEditable,
  onUpdate,
  isLoading = false,
}) => {
  const { classes } = useStyle();
  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  const [updateValue, setUpdateValue] = useState<string>("");

  const onClick = () => {
    if (isEditable) {
      setIsUpdate(true);
      setUpdateValue(value?.toString() || "0");
    }
  };

  const handleInputChange = (v: string) => {
    setUpdateValue(v);
  };

  const handleUpdate = async () => {
    const numValue = Number(updateValue) || 0;
    if (numValue !== value) {
      await onUpdate(numValue);
    }
    setIsUpdate(false);
  };

  const handleCancel = () => {
    setIsUpdate(false);
    setUpdateValue(value?.toString() || "0");
  };

  const handleClickOutside = () => {
    handleUpdate();
  };

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      {isLoading && <DotsLoader />}
      {isUpdate ? (
        <UpdateValueInput
          value={updateValue}
          onInputChange={handleInputChange}
          onUpdate={handleUpdate}
          onCancel={handleCancel}
          clickedOut={handleClickOutside}
          style={classes.updateInputStyle}
        />
      ) : (
        <div
          style={{
            ...classes.updateInputStyle,
            cursor: isEditable ? "pointer" : "default",
          }}
          onClick={onClick}
        >
          {value?.toFixed(2) || "0.00"}
        </div>
      )}
    </Stack>
  );
};

export { InventoryPriceInput };

