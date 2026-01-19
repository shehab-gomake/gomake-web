import { GomakeTextInput } from "@/components";
import { DeleteMaterial, EditIcon } from "@/icons";
import { IconButton, Paper, Stack } from "@mui/material";
import { MuiColorInput } from "mui-color-input";
import { useState } from "react";
import PrinterSelector from "./printer-selector";
import { TrashIcon } from "@/components/icons/trash-icon";
import { EditPencilIcon } from "@/components/icons/edit-pencil-icon";

const ProductItem = ({
  t,
  item,
  onClickOpenDeleteRowModal,
  onSaveEdit,
  classes,
  isPrintHouseUsePrintNode,
  getPrinterNameByPrinterId,
  getPrinterBins,
  printers,
  primaryColor,
  errorColor,
}) => {
  const [editingData, setEditingData] = useState({
    id: item.id,
    name: item.name,
    code: item.code,
    productionFloorJobColor: item.productionFloorJobColor || "var(--theme-primary-color, #2E3092)",
    printerBin: item.printerBin || "",
    printerId: item.printerId || 0,
  });

  const handleEditFieldChange = (field, value) => {
    const updatedData = { ...editingData, [field]: value };
    setEditingData(updatedData);
    //onSaveEdit(updatedData);
  };

  return (
    <div key={item.id} style={classes.productMappingContainer}>
      <div>
        <GomakeTextInput
          style={classes.textInputStyle}
          value={editingData.name}
          onChange={(e) => handleEditFieldChange("name", e.target.value)}
        />
      </div>
      <div>
        <GomakeTextInput
          style={classes.textInputStyle}
          value={editingData.code}
          onChange={(e) => handleEditFieldChange("code", e.target.value)}
        />
      </div>
      <div style={classes.colorInputStyle}>
        <MuiColorInput
          value={editingData.productionFloorJobColor}
          format="hex"
          onChange={(value) =>
            handleEditFieldChange("productionFloorJobColor", value)
          }
          sx={{
            "& .MuiOutlinedInput-notchedOutline": {
              border: "none",
            },
            "& .MuiOutlinedInput-root fieldset": {
              border: "none",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              border: "none",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              border: "none",
            },
          }}
        />
      </div>
      {isPrintHouseUsePrintNode && (
        <PrinterSelector
          printerId={editingData.printerId}
          printerBin={editingData.printerBin}
          onEdit={handleEditFieldChange}
          getPrinterNameByPrinterId={getPrinterNameByPrinterId}
          getPrinterBins={(id) => (id ? getPrinterBins(id) : [])}
          printers={printers}
          classes={classes}
          t={t}
        />
      )}
      <Stack direction={"row"}>
        <IconButton onClick={() => onSaveEdit(editingData)}>
          <EditPencilIcon height={20} width={20} color={primaryColor(500)} />
        </IconButton>
        <IconButton onClick={() => onClickOpenDeleteRowModal(editingData?.id)}>
          <TrashIcon height={20} width={20} color={errorColor(500)} />
        </IconButton>
      </Stack>
    </div>
  );
};

export default ProductItem;
