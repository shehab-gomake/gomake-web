import { useCallback, useState } from "react";
import { useStyle } from "../../style";
import { Switch } from "@mui/material";
import { useGomakeAxios, useSnackBar } from "@/hooks";
import { useTranslation } from "react-i18next";
import { SheetCheckBox } from "../checkbox";
import { GomakeTextInput } from "@/components";
import { UpdateStockApplication } from "@/pages/materials/applications/more-circle/update-stock-application";

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
  const [pricePerRoll, setPricePerRoll] = useState(row?.pricePerRoll);
  const [pricePerSquareMeter, setPricePerSquareMeter] = useState(
    row?.pricePerSquareMeter
  );

  const updateToActive = useCallback(async () => {
    const res = await callApi("POST", `/v1/applications/size-id-settngs`, {
      categoryName: selectedMaterials?.key,
      supplierId: selectedSupplier,
      actionType: 3,
      data: [
        {
          sizeId: row?.sizeId,
          thicknessId: row?.thicknessId,
        },
      ],
    });

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
    const res = await callApi("POST", `/v1/applications/size-id-settngs`, {
      categoryName: selectedMaterials?.key,
      supplierId: selectedSupplier,
      actionType: 4,
      data: [
        {
          sizeId: row?.sizeId,
          thicknessId: row?.thicknessId,
        },
      ],
    });
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
  const updatePricePerRoll = useCallback(async () => {
    const res = await callApi("POST", `/v1/applications/size-id-settngs`, {
      categoryName: selectedMaterials?.key,
      supplierId: selectedSupplier,
      actionType: 9,
      data: [
        {
          data: pricePerRoll,
          sizeId: row?.sizeId,
          thicknessId: row?.thicknessId,
        },
      ],
    });

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
  }, [row, selectedMaterials, selectedSupplier, pricePerRoll]);
  const updatePricePerSquareMeter = useCallback(async () => {
    const res = await callApi("POST", `/v1/applications/size-id-settngs`, {
      categoryName: selectedMaterials?.key,
      supplierId: selectedSupplier,
      actionType: 8,
      data: [
        {
          data: pricePerSquareMeter,
          sizeId: row?.sizeId,
          thicknessId: row?.thicknessId,
        },
      ],
    });

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
  }, [row, selectedMaterials, selectedSupplier, pricePerSquareMeter]);
  return (
    <div style={index2 % 2 == 0 ? clasess.bodyRow : clasess.secondRow}>
      <div style={clasess.checkboxHeaderContainer}>
        <SheetCheckBox
          selectedItems={selectedItems}
          handleCheckboxChange={handleCheckboxChange}
          row={row}
        />
      </div>
      <div style={clasess.thiknessContainer}>{row?.size}</div>
      <div style={clasess.thiknessContainer}>{row?.thickness}</div>
      <div style={clasess.thiknessContainer}>{row?.weightPerSquareMeter}</div>
      {/* <div style={clasess.costsContainer}>
        <GomakeTextInput
          style={clasess.thiknessTextInputStyle}
          value={pricePerRoll}
          onChange={(event: any) => setPricePerRoll(event.target.value)}
          onBlur={updatePricePerRoll}
        />
      </div> */}
      <div style={clasess.directionContainer}>
        <GomakeTextInput
          style={clasess.thiknessTextInputStyle}
          value={pricePerSquareMeter}
          onChange={(event: any) => setPricePerSquareMeter(event.target.value)}
          onBlur={updatePricePerSquareMeter}
        />
      </div>

      <div style={clasess.currencyContainer}>{row?.currency}</div>
      <div style={clasess.stokContainer}>
        <UpdateStockApplication
          categoryName={selectedMaterials?.key}
          sizeId={row?.sizeId}
          stockValue={row?.stock}
          thicknessId={row?.thicknessId}
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
