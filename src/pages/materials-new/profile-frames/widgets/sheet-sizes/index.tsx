import { useCallback, useState } from "react";
import { useStyle } from "../../style";
import { Switch } from "@mui/material";
import { useGomakeAxios, useSnackBar } from "@/hooks";
import { useTranslation } from "react-i18next";
import { SheetCheckBox } from "../checkbox";
import { GomakeTextInput } from "@/components";
import { UpdateStockProfileFrame } from "@/pages/materials/profile-frames/update-stock-profile-frame/update-stock-profile-frame";

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
  const [pricePerMeter, setPricePerMeter] = useState(row?.pricePerMeter);
  const updateToActive = useCallback(async () => {
    const res = await callApi("POST", `/v1/profile-frames/size-id-settngs`, {
      categoryName: selectedMaterials?.key,
      supplierId: selectedSupplier,
      actionType: 3,
      data: [
        {
          sizeId: row?.sizeId,
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
    const res = await callApi("POST", `/v1/profile-frames/size-id-settngs`, {
      categoryName: selectedMaterials?.key,
      supplierId: selectedSupplier,
      actionType: 4,
      data: [
        {
          sizeId: row?.sizeId,
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
  const updatepricePerUnit = useCallback(async () => {
    const res = await callApi("POST", `/v1/profile-frames/size-id-settngs`, {
      categoryName: selectedMaterials?.key,
      supplierId: selectedSupplier,
      actionType: 1,
      data: [
        {
          data: pricePerUnit,
          sizeId: row?.sizeId,
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
  const updatePricePerMeter = useCallback(async () => {
    const res = await callApi("POST", `/v1/profile-frames/size-id-settngs`, {
      categoryName: selectedMaterials?.key,
      supplierId: selectedSupplier,
      actionType: 10,
      data: [
        {
          data: pricePerMeter,
          sizeId: row?.sizeId,
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
  }, [row, selectedMaterials, selectedSupplier, pricePerMeter]);
  return (
    <div style={index2 % 2 == 0 ? clasess.bodyRow : clasess.secondRow}>
      <div style={clasess.checkboxHeaderContainer}>
        <SheetCheckBox
          selectedItems={selectedItems}
          handleCheckboxChange={handleCheckboxChange}
          row={row}
        />
      </div>
      <div style={clasess.thiknessContainer}>{row?.width}</div>
      <div style={clasess.costsContainer}>{row?.height}</div>
      <div style={clasess.costsContainer}> {row?.length}</div>
      <div style={clasess.directionContainer}>
        <GomakeTextInput
          style={clasess.thiknessTextInputStyle}
          value={pricePerUnit}
          onChange={(event: any) => setPricePerUnit(event.target.value)}
          onBlur={updatepricePerUnit}
        />
      </div>
      <div style={clasess.directionContainer}>
        <GomakeTextInput
          style={clasess.thiknessTextInputStyle}
          value={pricePerMeter}
          onChange={(event: any) => setPricePerMeter(event.target.value)}
          onBlur={updatePricePerMeter}
        />
      </div>
      <div style={clasess.activeContainer}>
        <Switch
          checked={row?.isActive}
          onChange={(e: any) => onChangeActiveState(e.target.checked)}
        />
      </div>
      <div style={clasess.currencyContainer}>{row?.currency}</div>
      <div style={clasess.stokContainer}>
        <UpdateStockProfileFrame
          categoryName={selectedMaterials?.key}
          sizeId={row?.sizeId}
          stockValue={row?.stock}
        />
      </div>
    </div>
  );
};
export { SheetSizesWidget };
