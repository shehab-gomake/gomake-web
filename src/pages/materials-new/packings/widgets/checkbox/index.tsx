import { Checkbox } from "@mui/material";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { sheetCheckAllState } from "../../store/sheet-check-all";

const SheetCheckBox = ({ selectedItems, handleCheckboxChange, row }) => {
  const [checked, setChecked] = useState(false);
  const [sheetStore, setSheetStore] = useRecoilState(sheetCheckAllState);

  useEffect(() => {
    setChecked(selectedItems.some((item) => item.volumeId === row?.volumeId));
  }, [selectedItems]);

  useEffect(() => {
    handleCheckboxChange(row.volumeId, sheetStore);
  }, [sheetStore]);
  return (
    <Checkbox
      checked={checked}
      onChange={(event) => {
        handleCheckboxChange(row.volumeId, event.target.checked);
      }}
    />
  );
};

export { SheetCheckBox };
