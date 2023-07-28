import { useCallback, useEffect, useState } from "react";

import { useDebounce } from "@/utils/use-debounce";
import { GomakeTextInput } from "@/components";
import { useGomakeAxios, useSnackBar } from "@/hooks";

import { IUpdateCanvasFramesStock } from "./update-additions.interface";
import { FONT_FAMILY } from "@/utils/font-family";
import { useTranslation } from "react-i18next";

const UpdateStockCanvasFrames = ({
  stockValue,
  categoryName,
  sizeId,
}: IUpdateCanvasFramesStock) => {
  const { callApi } = useGomakeAxios();

  const [stock, setStock] = useState(stockValue);
  const [isChanged, setIsChanged] = useState(false);
  const { setSnackbarStateValue } = useSnackBar();
  const { t } = useTranslation();
  const debounce = useDebounce(stock, 500);
  const [finalStock, setFinalStock] = useState("");
  useEffect(() => {
    setFinalStock(debounce);
  }, [debounce]);

  const onChange = useCallback(
    (e: any) => {
      setIsChanged(true);
      setStock(e.target.value);
    },
    [setIsChanged]
  );
  const updateStock = useCallback(async () => {
    const updated = await callApi("POST", "/v1/canvas-frames/update-stock", {
      stock: finalStock,
      categoryName,
      sizeId,
    });
    if (updated?.success) {
      setSnackbarStateValue({
        state: true,
        message: t("modal.updatedSusuccessfully"),
        type: "sucess",
      });
    } else {
      setSnackbarStateValue({
        state: true,
        message: t("modal.updatedfailed"),
        type: "error",
      });
    }
  }, [finalStock]);
  useEffect(() => {
    if (finalStock && isChanged) {
      updateStock();
    }
  }, [finalStock, isChanged, stockValue]);
  useEffect(() => {
    setStock(stockValue);
  }, [stockValue]);

  return (
    <GomakeTextInput
      value={stock}
      type={"number"}
      onChange={onChange}
      style={{
        height: 38,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        ...FONT_FAMILY.Lexend(400, 14),
        color: "#2E3092",
        textAlign: "center" as "center",
        backgroundColor: "transparent",
        paddingLeft: 2,
        boxShadow: "none",
      }}
    />
  );
};
export { UpdateStockCanvasFrames };
