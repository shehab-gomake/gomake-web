import { useCallback, useState } from "react";
import { useStyle } from "../../style";
import { Switch } from "@mui/material";
import { useGomakeAxios, useSnackBar } from "@/hooks";
import { useTranslation } from "react-i18next";
import { GomakeTextInput } from "@/components";
import { UpdateStockSheetPaperSizeses } from "@/pages/materials/sheet-paper/more-circle/update-stock-sheet-paper";

const SheetSizesWidget = ({
  index2,
  size,
  row,
  selectedMaterials,
  selectedSupplier,
  getSheetAllWeights,
}) => {
  const { clasess } = useStyle();
  const { t } = useTranslation();
  const { callApi } = useGomakeAxios();
  const { setSnackbarStateValue } = useSnackBar();
  const [pricePerUnit, setPricePerUnit] = useState(size?.pricePerUnit);
  const [pricePerTon, setPricePerTon] = useState(size?.pricePerTon);
  const [thickness, setThickness] = useState(size?.thickness);
  const [directions, setDirections] = useState(size?.direction);
  const updateToActive = useCallback(async () => {
    const res = await callApi("POST", `/v1/sheets/size-id-settngs`, {
      categoryName: selectedMaterials?.key,
      supplierId: selectedSupplier,
      actionType: 3,
      data: [
        {
          weightId: row?.weightId,
          sizeId: size?.id,
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
  }, [row, size, selectedMaterials, selectedSupplier]);
  const updateToInActive = useCallback(async () => {
    const res = await callApi("POST", `/v1/sheets/size-id-settngs`, {
      categoryName: selectedMaterials?.key,
      supplierId: selectedSupplier,
      actionType: 4,
      data: [
        {
          weightId: row?.weightId,
          sizeId: size?.id,
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
  }, [row, size, selectedMaterials, selectedSupplier]);
  const onChangeActiveState = (value: any) => {
    if (value === true) {
      updateToActive();
    } else {
      updateToInActive();
    }
  };
  const updatePricePerUnit = useCallback(async () => {
    const res = await callApi("POST", `/v1/sheets/size-id-settngs`, {
      categoryName: selectedMaterials?.key,
      supplierId: selectedSupplier,
      actionType: 1,
      data: [
        {
          data: pricePerUnit,
          weightId: row?.weightId,
          sizeId: size?.id,
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
  }, [row, selectedMaterials, selectedSupplier, pricePerUnit]);
  const updatePricePerTon = useCallback(async () => {
    const res = await callApi("POST", `/v1/sheets/size-id-settngs`, {
      categoryName: selectedMaterials?.key,
      supplierId: selectedSupplier,
      actionType: 0,
      data: [
        {
          data: pricePerTon,
          weightId: row?.weightId,
          sizeId: size?.id,
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
  }, [row, selectedMaterials, selectedSupplier, pricePerTon]);
  const updateThickness = useCallback(async () => {
    const res = await callApi("POST", `/v1/sheets/size-id-settngs`, {
      categoryName: selectedMaterials?.key,
      supplierId: selectedSupplier,
      actionType: 13,
      data: [
        {
          data: thickness,
          weightId: row?.weightId,
          sizeId: size?.id,
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
  }, [row, selectedMaterials, selectedSupplier, thickness]);
  const updateDirections = useCallback(async () => {
    const res = await callApi("POST", `/v1/sheets/size-id-settngs`, {
      categoryName: selectedMaterials?.key,
      supplierId: selectedSupplier,
      actionType: 14,
      data: [
        {
          data: directions,
          weightId: row?.weightId,
          sizeId: size?.id,
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
  }, [row, selectedMaterials, selectedSupplier, directions]);
  return (
    <div style={index2 % 2 == 0 ? clasess.bodyRow : clasess.secondRow}>
      <div style={clasess.sizeContainer}>
        {size?.width}X{size?.height}
      </div>
      <div style={clasess.thiknessContainer}>
        <GomakeTextInput
          style={clasess.thiknessTextInputStyle}
          value={thickness}
          onChange={(event: any) => setThickness(event.target.value)}
          onBlur={updateThickness}
        />
      </div>
      <div style={clasess.costsContainer}>
        <GomakeTextInput
          style={clasess.thiknessTextInputStyle}
          value={pricePerUnit}
          onChange={(event: any) => setPricePerUnit(event.target.value)}
          onBlur={updatePricePerUnit}
        />
        /
        <GomakeTextInput
          style={clasess.thiknessTextInputStyle}
          value={pricePerTon}
          onChange={(event: any) => setPricePerTon(event.target.value)}
          onBlur={updatePricePerTon}
        />
      </div>
      <div style={clasess.currencyContainer}>{size?.currency}</div>
      <div style={clasess.directionContainer}>
        <GomakeTextInput
          style={clasess.thiknessTextInputStyle}
          value={directions}
          onChange={(event: any) => setDirections(event.target.value)}
          onBlur={updateDirections}
        />
      </div>
      <div style={clasess.stokContainer}>
        <UpdateStockSheetPaperSizeses
          categoryName={selectedMaterials?.key}
          sizeId={size?.id}
          stockValue={size?.stock}
          weightId={row?.weightId}
        />
      </div>
      <div style={clasess.activeContainer}>
        <Switch
          checked={size?.isActive}
          onChange={(e: any) => onChangeActiveState(e.target.checked)}
        />
      </div>
    </div>
  );
};
export { SheetSizesWidget };
