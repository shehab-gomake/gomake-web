import { useCallback, useState } from "react";
import { useStyle } from "../../style";
import { Switch } from "@mui/material";
import { useGomakeAxios, useSnackBar } from "@/hooks";
import { useTranslation } from "react-i18next";
import { SheetCheckBox } from "../checkbox";

const SheetSizesWidget = ({
  row,
  selectedMaterials,
  selectedSupplier,
  getSheetAllWeights,
  index2,
}) => {
  const { clasess } = useStyle();
  const { t } = useTranslation();
  const { callApi } = useGomakeAxios();
  const { setSnackbarStateValue } = useSnackBar();

  const updateToActive = useCallback(async () => {
    const res = await callApi("POST", `/v1/colors/size-id-settngs`, {
      categoryName: selectedMaterials.code,
      supplierId: selectedSupplier,
      actionType: 3,
      data: {},
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
    const res = await callApi("POST", `/v1/colors/size-id-settngs`, {
      categoryName: selectedMaterials.code,
      supplierId: selectedSupplier,
      actionType: 4,
      data: {},
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

  return (
    <div style={index2 % 2 == 0 ? clasess.bodyRow : clasess.secondRow}>
      {/* <div style={clasess.costsContainer}>{row?.weightPerLiter}</div>
      <div style={clasess.costsContainer}>{row?.typeName}</div> */}
      <div style={clasess.costsContainer}>{row?.volumeInLiters}</div>
      <div style={clasess.costsContainer}>{row?.literInSquareMeter}</div>
      <div style={clasess.costsContainer}>{row?.pricePerContainer}</div>
      <div style={clasess.costsContainer}>{row?.pricePerLiter}</div>
      <div style={clasess.currencyContainer}>{row?.currency}</div>
      <div style={clasess.activeContainer}>
        <Switch
          checked={row?.isActive}
          onChange={(e: any) => onChangeActiveState(e.target.checked)}
        />
      </div>
      <div style={clasess.stokContainer}>{row?.stock}</div>
    </div>
  );
};
export { SheetSizesWidget };
