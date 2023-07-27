import { useCallback, useState } from "react";
import { useStyle } from "../../style";
import { Switch } from "@mui/material";
import { useGomakeAxios, useSnackBar } from "@/hooks";
import { useTranslation } from "react-i18next";
import { GomakeTextInput } from "@/components";
import { UpdateStockMagnet } from "./update-stock-magnet";

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
  const [price, setPrice] = useState(row?.price);
  const updateToActive = useCallback(async () => {
    const res = await callApi("POST", `/v1/magnets/size-id-settngs`, {
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
    const res = await callApi("POST", `/v1/magnets/size-id-settngs`, {
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
  const updatePrice = useCallback(async () => {
    const res = await callApi("POST", `/v1/magnets/size-id-settngs`, {
      categoryName: selectedMaterials?.code,
      supplierId: selectedSupplier,
      actionType: 6,
      data: {
        data: price,
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
  }, [row, selectedMaterials, selectedSupplier, price]);
  return (
    <div style={index2 % 2 == 0 ? clasess.bodyRow : clasess.secondRow}>
      <div style={clasess.costsContainer}>{row?.width}</div>
      <div style={clasess.costsContainer}>{row?.height}</div>
      <div style={clasess.costsContainer}>{row?.weight}</div>
      {/* <div style={clasess.thiknessContainer}>{row?.thickness}</div> */}
      <div style={clasess.costsContainer}>{row?.withGlue ? "Yes" : "No"}</div>

      <div style={clasess.costsContainer}>{row?.linkage ? "Yes" : "No"}</div>
      <div style={clasess.costsContainer}>
        {row?.directPrinting ? "Yes" : "No"}
      </div>
      <div style={clasess.costsContainer}>
        <GomakeTextInput
          style={clasess.thiknessTextInputStyle}
          value={price}
          onChange={(event: any) => setPrice(event.target.value)}
          onBlur={updatePrice}
        />
      </div>

      <div style={clasess.currencyContainer}>{row?.currency}</div>
      <div style={clasess.stokContainer}>
        <UpdateStockMagnet
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
