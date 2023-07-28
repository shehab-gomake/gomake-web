import { Checkbox } from "@mui/material";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { sheetCheckAllState } from "../../store/sheet-check-all";

const SheetCheckBox = ({ selectedItems, handleCheckboxChange, row }) => {
  const [checked, setChecked] = useState(false);
  const [sheetStore, setSheetStore] = useRecoilState(sheetCheckAllState);

  useEffect(() => {
    setChecked(selectedItems.some((item) => item.volumeId === row?.id));
  }, [selectedItems]);

  useEffect(() => {
    handleCheckboxChange(row.id, sheetStore);
  }, [sheetStore]);
  return (
    <Checkbox
      checked={checked}
      onChange={(event) => {
        handleCheckboxChange(row.id, event.target.checked);
      }}
    />
  );
};

export { SheetCheckBox };
