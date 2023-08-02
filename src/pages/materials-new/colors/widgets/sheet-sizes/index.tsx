import { useCallback, useState } from "react";
import { useStyle } from "../../style";
import { Switch } from "@mui/material";
import { useGomakeAxios, useSnackBar } from "@/hooks";
import { useTranslation } from "react-i18next";
import { GomakeTextInput } from "@/components";
import { UpdateStockColors } from "./update-stock-color";

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
  const [pricePerContainer, setPricePerContainer] = useState(
    row?.pricePerContainer
  );
  const [pricePerLiter, setPricePerLiter] = useState(row?.pricePerLiter);
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

  const updatePricePerContainer = useCallback(async () => {
    const res = await callApi("POST", `/v1/colors/size-id-settngs`, {
      categoryName: selectedMaterials?.code,
      supplierId: selectedSupplier,
      actionType: 12,
      data: {
        data: pricePerContainer,
      },
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
  }, [row, selectedMaterials, selectedSupplier, pricePerContainer]);

  const updatePricePerLiter = useCallback(async () => {
    const res = await callApi("POST", `/v1/colors/size-id-settngs`, {
      categoryName: selectedMaterials?.code,
      supplierId: selectedSupplier,
      actionType: 11,
      data: {
        data: pricePerLiter,
      },
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
  }, [row, selectedMaterials, selectedSupplier, pricePerLiter]);
  return (
    <div style={index2 % 2 == 0 ? clasess.bodyRow : clasess.secondRow}>
      <div style={clasess.costsContainer}>Machine</div>
      <div style={clasess.costsContainer}>{row?.volumeInLiters}</div>
      <div style={clasess.costsContainer}>BE</div>
      <div style={clasess.costsContainer}>BE</div>

      <div style={clasess.costsContainer}>{row?.literInSquareMeter}</div>
      {/* <div style={clasess.costsContainer}>
        <GomakeTextInput
          style={clasess.thiknessTextInputStyle}
          value={pricePerContainer}
          onChange={(event: any) => setPricePerContainer(event.target.value)}
          onBlur={updatePricePerContainer}
        />
      </div> */}
      <div style={clasess.costsContainer}>
        <GomakeTextInput
          style={clasess.thiknessTextInputStyle}
          value={pricePerLiter}
          onChange={(event: any) => setPricePerLiter(event.target.value)}
          onBlur={updatePricePerLiter}
        />
      </div>
      <div style={clasess.currencyContainer}>{row?.currency}</div>

      <div style={clasess.stokContainer}>
        <UpdateStockColors
          stockValue={row?.stock}
          code={selectedMaterials?.code}
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
