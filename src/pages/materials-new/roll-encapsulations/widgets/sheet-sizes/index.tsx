import { useCallback, useState } from "react";
import { useStyle } from "../../style";
import { Switch } from "@mui/material";
import { useGomakeAxios, useSnackBar } from "@/hooks";
import { useTranslation } from "react-i18next";
import { GomakeTextInput } from "@/components";
import { UpdateStockEncapsulationRoll } from "@/pages/materials/encapsulation-roll/more-circle/update-stock-encapsulation-roll";

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
  const [pricePerSquareMeter, setPricePerSquareMeter] = useState(
    size?.pricePerSquareMeter
  );

  const updateToActive = useCallback(async () => {
    const res = await callApi(
      "POST",
      `/v1/roll-encapsulations/size-id-settngs`,
      {
        categoryName: selectedMaterials?.key,
        supplierId: selectedSupplier,
        actionType: 3,
        data: [
          {
            thicknessId: row?.thicknessId,
            sizeId: size?.sizeId,
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
  }, [row, size, selectedMaterials, selectedSupplier]);
  const updateToInActive = useCallback(async () => {
    const res = await callApi(
      "POST",
      `/v1/roll-encapsulations/size-id-settngs`,
      {
        categoryName: selectedMaterials?.key,
        supplierId: selectedSupplier,
        actionType: 4,
        data: [
          {
            thicknessId: row?.thicknessId,
            sizeId: size?.sizeId,
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
  }, [row, size, selectedMaterials, selectedSupplier]);
  const onChangeActiveState = (value: any) => {
    if (value === true) {
      updateToActive();
    } else {
      updateToInActive();
    }
  };
  const updatePricePerSquareMeter = useCallback(async () => {
    const res = await callApi(
      "POST",
      `/v1/roll-encapsulations/size-id-settngs`,
      {
        categoryName: selectedMaterials?.key,
        supplierId: selectedSupplier,
        actionType: 8,
        data: [
          {
            data: pricePerSquareMeter,
            sizeId: size?.sizeId,
            thicknessId: row?.thicknessId,
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
  }, [row, selectedMaterials, selectedSupplier, pricePerSquareMeter]);
  return (
    <div style={index2 % 2 == 0 ? clasess.bodyRow : clasess.secondRow}>
      <div style={clasess.sizeContainer}>{size?.size}</div>
      <div style={clasess.thiknessContainer}>
        <GomakeTextInput
          style={clasess.thiknessTextInputStyle}
          value={pricePerSquareMeter}
          onChange={(event: any) => setPricePerSquareMeter(event.target.value)}
          onBlur={updatePricePerSquareMeter}
        />
      </div>
      <div style={clasess.activeContainer}>
        <Switch
          checked={size?.isActive}
          onChange={(e: any) => onChangeActiveState(e.target.checked)}
        />
      </div>
      <div style={clasess.currencyContainer}>{size?.currency}</div>
      <div style={clasess.stokContainer}>
        <UpdateStockEncapsulationRoll
          categoryName={selectedMaterials?.key}
          sizeId={size?.sizeId}
          stockValue={size?.stock}
          thicknessId={row?.thicknessId}
        />
      </div>
    </div>
  );
};
export { SheetSizesWidget };
