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
  clasess,
  isPrintHouseUsePrintNode,
  getPrinterNameByPrinterId,
  getPrinterBins,
  printers,
}) => {
  const [editingData, setEditingData] = useState({
    id: item.id,
    name: item.name,
    code: item.code,
    productionFloorJobColor: item.productionFloorJobColor || "#2e3092",
    printerBin: item.printerBin || "",
    printerId: item.printerId || 0,
  });

  const handleEditFieldChange = (field, value) => {
    const updatedData = { ...editingData, [field]: value };
    setEditingData(updatedData);
    //onSaveEdit(updatedData);
  };

  return (
    <div key={item.id} style={clasess.productMappingContainer}>
      <div>
        <GomakeTextInput
          style={clasess.textInputStyle}
          value={editingData.name}
          onChange={(e) => handleEditFieldChange("name", e.target.value)}
        />
      </div>
      <div>
        <GomakeTextInput
          style={clasess.textInputStyle}
          value={editingData.code}
          onChange={(e) => handleEditFieldChange("code", e.target.value)}
        />
      </div>
      <div style={clasess.colorInputStyle}>
        <MuiColorInput
          value={editingData.productionFloorJobColor}
          format="hex"
          onChange={(value) =>
            handleEditFieldChange("productionFloorJobColor", value)
          }
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
          clasess={clasess}
          t={t}
        />
      )}
      <Stack direction={"row"}>
        <IconButton onClick={() => onSaveEdit(editingData)}>
          <EditPencilIcon height={20} width={20} color="#2E3092" />
        </IconButton>
        <IconButton onClick={() => onClickOpenDeleteRowModal(editingData?.id)}>
          <TrashIcon height={20} width={20} color="red" />
        </IconButton>
      </Stack>
    </div>
  );
};

export default ProductItem;
