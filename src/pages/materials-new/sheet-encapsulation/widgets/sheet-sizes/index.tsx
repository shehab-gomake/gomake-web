import { useCallback, useState } from "react";
import { useStyle } from "../../style";
import { Switch } from "@mui/material";
import { useGomakeAxios, useSnackBar } from "@/hooks";
import { useTranslation } from "react-i18next";
import { SheetCheckBox } from "../checkbox";
import { GomakeTextInput } from "@/components";
import { UpdateStockSheetEncapsulation } from "./update-stock-sheet-encapsulation";

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
  const [pricePerUnit, setPricePerUnit] = useState(row?.pricePerUnit);
  const updateToActive = useCallback(async () => {
    const res = await callApi(
      "POST",
      `/v1/sheet-encapsulation/size-id-settngs`,
      {
        categoryName: selectedMaterials?.key,
        supplierId: selectedSupplier,
        actionType: 3,
        data: [
          {
            sizeId: row?.sizeId,
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
      `/v1/sheet-encapsulation/size-id-settngs`,
      {
        categoryName: selectedMaterials?.key,
        supplierId: selectedSupplier,
        actionType: 4,
        data: [
          {
            sizeId: row?.sizeId,
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
  const updatePricePerUnit = useCallback(async () => {
    const res = await callApi(
      "POST",
      `/v1/sheet-encapsulation/size-id-settngs`,
      {
        categoryName: selectedMaterials?.key,
        supplierId: selectedSupplier,
        actionType: 1,
        data: [
          {
            data: pricePerUnit,
            sizeId: row?.sizeId,
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
  }, [row, selectedMaterials, selectedSupplier, pricePerUnit]);
  return (
    <div style={index2 % 2 == 0 ? clasess.bodyRow : clasess.secondRow}>
      <div style={clasess.checkboxHeaderContainer}>
        <SheetCheckBox
          selectedItems={selectedItems}
          handleCheckboxChange={handleCheckboxChange}
          row={row}
        />
      </div>
      <div style={clasess.sizeContainer}>{row?.weight}</div>
      <div style={clasess.thiknessContainer}>{row?.width}</div>
      <div style={clasess.costsContainer}>{row?.height}</div>
      <div style={clasess.directionContainer}>
        {" "}
        <GomakeTextInput
          style={clasess.thiknessTextInputStyle}
          value={pricePerUnit}
          onChange={(event: any) => setPricePerUnit(event.target.value)}
          onBlur={updatePricePerUnit}
        />
      </div>
      <div style={clasess.directionContainer}>{row?.quantityInPackage}</div>
      <div style={clasess.activeContainer}>
        <Switch
          checked={row?.isActive}
          onChange={(e: any) => onChangeActiveState(e.target.checked)}
        />
      </div>
      <div style={clasess.currencyContainer}>{row?.currency}</div>
      <div style={clasess.stokContainer}>
        <UpdateStockSheetEncapsulation
          categoryName={selectedMaterials?.key}
          sizeId={row?.sizeId}
          stockValue={row?.stock}
        />
      </div>
    </div>
  );
};
export { SheetSizesWidget };
