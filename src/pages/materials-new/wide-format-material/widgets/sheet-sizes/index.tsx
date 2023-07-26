import { useCallback, useState } from "react";
import { useStyle } from "../../style";
import { Switch } from "@mui/material";
import { useGomakeAxios, useSnackBar } from "@/hooks";
import { useTranslation } from "react-i18next";
import { SheetCheckBox } from "../checkbox";
import { GomakeTextInput } from "@/components";
import { UpdateStockWildPrintingMaterialSizeses } from "@/pages/materials/wild-printing-materials/more-circle/update-stock-sheet-paper";

const SheetSizesWidget = ({
  row,
  selectedMaterials,
  selectedSupplier,
  getSheetAllWeights,
  index2,
  selectedItems,
  handleCheckboxChange,
}) => {
  const { clasess } = useStyle();
  const { t } = useTranslation();
  const { callApi } = useGomakeAxios();
  const { setSnackbarStateValue } = useSnackBar();
  const [pricePerMeterSquare, setPricePerMeterSquare] = useState(
    row?.pricePerMeterSquare
  );

  const updateToActive = useCallback(async () => {
    const res = await callApi(
      "POST",
      `/v1/wide-format-material/size-id-settngs`,
      {
        categoryName: selectedMaterials?.key,
        supplierId: selectedSupplier,
        actionType: 3,
        data: [
          {
            sizeId: row?.sizeId,
            typeId: row?.typeId,
          },
        ],
      }
    );

    if (res?.success) {
      setSnackbarStateValue({
        state: true,
        message: t("modal.updatedSusuccessfully"),
        type: "sucess",
      });
      getSheetAllWeights(selectedMaterials, selectedSupplier);
    } else {
      setSnackbarStateValue({
        state: true,
        message: t("modal.updatedfailed"),
        type: "error",
      });
    }
  }, [row, selectedMaterials, selectedSupplier]);
  const updateToInActive = useCallback(async () => {
    const res = await callApi(
      "POST",
      `/v1/wide-format-material/size-id-settngs`,
      {
        categoryName: selectedMaterials?.key,
        supplierId: selectedSupplier,
        actionType: 4,
        data: [
          {
            sizeId: row?.sizeId,
            typeId: row?.typeId,
          },
        ],
      }
    );
    if (res?.success) {
      setSnackbarStateValue({
        state: true,
        message: t("modal.updatedSusuccessfully"),
        type: "sucess",
      });
      getSheetAllWeights(selectedMaterials, selectedSupplier);
    } else {
      setSnackbarStateValue({
        state: true,
        message: t("modal.updatedfailed"),
        type: "error",
      });
    }
  }, [row, selectedMaterials, selectedSupplier]);
  const onChangeActiveState = (value: any) => {
    if (value === true) {
      updateToActive();
    } else {
      updateToInActive();
    }
  };
  const updatePricePerMeterSquare = useCallback(async () => {
    const res = await callApi(
      "POST",
      `/v1/wide-format-material/size-id-settngs`,
      {
        categoryName: selectedMaterials?.key,
        supplierId: selectedSupplier,
        actionType: 8,
        data: [
          {
            data: pricePerMeterSquare,
            sizeId: row?.sizeId,
            typeId: row?.typeId,
          },
        ],
      }
    );

    if (res?.success) {
      setSnackbarStateValue({
        state: true,
        message: t("modal.updatedSusuccessfully"),
        type: "sucess",
      });
      getSheetAllWeights(selectedMaterials, selectedSupplier);
    } else {
      setSnackbarStateValue({
        state: true,
        message: t("modal.updatedfailed"),
        type: "error",
      });
    }
  }, [row, selectedMaterials, selectedSupplier, pricePerMeterSquare]);
  return (
    <div style={index2 % 2 == 0 ? clasess.bodyRow : clasess.secondRow}>
      <div style={clasess.checkboxHeaderContainer}>
        <SheetCheckBox
          selectedItems={selectedItems}
          handleCheckboxChange={handleCheckboxChange}
          row={row}
        />
      </div>
      <div style={clasess.thiknessContainer}>{row?.type}</div>
      <div style={clasess.costsContainer}>{row?.size}</div>
      <div style={clasess.directionContainer}>{row?.thickness}</div>
      <div style={clasess.directionContainer}>{row?.weightPerMeterSquare}</div>
      <div style={clasess.directionContainer}>BE</div>
      <div style={clasess.directionContainer}>
        <GomakeTextInput
          style={clasess.thiknessTextInputStyle}
          value={pricePerMeterSquare}
          onChange={(event: any) => setPricePerMeterSquare(event.target.value)}
          onBlur={updatePricePerMeterSquare}
        />
      </div>
      <div style={clasess.currencyContainer}>{row?.currency}</div>
      <div style={clasess.stokContainer}>
        <UpdateStockWildPrintingMaterialSizeses
          categoryName={selectedMaterials?.key}
          sizeId={row?.sizeId}
          stockValue={row?.stock}
          typeId={row?.typeId}
        />
      </div>
      <div style={clasess.activeContainer}>
        <Switch
          checked={row?.isActive}
          onChange={(e: any) => onChangeActiveState(e.target.checked)}
        />
      </div>
    </div>
  );
};
export { SheetSizesWidget };
