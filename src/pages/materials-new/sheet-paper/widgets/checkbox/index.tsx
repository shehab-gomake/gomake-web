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
        (item) => item.weightId === item.weightId && item.sizeId === size?.id
      )
    );
  }, [selectedItems]);

  useEffect(() => {
    handleCheckboxChange(row.weightId, size?.id, sheetStore);
  }, [sheetStore]);
  return (
    <Checkbox
      checked={checked}
      onChange={(event) => {
        handleCheckboxChange(row.weightId, size?.id, event.target.checked);

        // console.log("HERE");
      }}
    />
  );
};

export { SheetCheckBox };
