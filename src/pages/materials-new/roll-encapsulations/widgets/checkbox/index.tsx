import { Checkbox } from "@mui/material";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { sheetCheckAllState } from "../../store/sheet-check-all";

const SheetCheckBox = ({ selectedItems, handleCheckboxChange, size, row }) => {
  const [checked, setChecked] = useState(false);
  const [sheetStore, setSheetStore] = useRecoilState(sheetCheckAllState);

  useEffect(() => {
    setChecked(
      selectedItems.some(
        (item) =>
          item.thicknessId === item.thicknessId && item.sizeId === size?.sizeId
      )
    );
  }, [selectedItems]);

  useEffect(() => {
    handleCheckboxChange(row.thicknessId, size?.sizeId, sheetStore);
  }, [sheetStore]);
  return (
    <Checkbox
      checked={checked}
      onChange={(event) => {
        handleCheckboxChange(
          row.thicknessId,
          size?.sizeId,
          event.target.checked
        );
      }}
    />
  );
};

export { SheetCheckBox };
