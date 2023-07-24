import { useCallback, useEffect, useState } from "react";

import { useDebounce } from "@/utils/use-debounce";
import { GomakeTextInput } from "@/components";
import { useGomakeAxios, useSnackBar } from "@/hooks";

import { IUpdateSheetPaperSizesStock } from "./update-stock.interface";
import { FONT_FAMILY } from "@/utils/font-family";
import { useTranslation } from "react-i18next";

const UpdateStockSheetPaperSizeses = ({
  categoryName,
  sizeId,
  stockValue,
  weightId,
}: IUpdateSheetPaperSizesStock) => {
  const { callApi } = useGomakeAxios();

  const [stock, setStock] = useState(stockValue);
  const [isChanged, setIsChanged] = useState(false);

  const debounce = useDebounce(stock, 500);
  const [finalStock, setFinalStock] = useState("");
  const { setSnackbarStateValue } = useSnackBar();
  const { t } = useTranslation();
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
  const updateStock = useCallback(
    async (categoryName: string, sizeId: string, weightId: string) => {
      const updated = await callApi("POST", "/v1/sheets/update-stock", {
        categoryName,
        sizeId,
        weightId,
        stock: finalStock,
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
    },
    [finalStock]
  );
  useEffect(() => {
    if (finalStock && isChanged) {
      updateStock(categoryName, sizeId, weightId);
    }
  }, [finalStock, isChanged, sizeId]);
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
        width: "100%",
        backgroundColor: "transparent",
        paddingLeft: 2,
        boxShadow: "none",
      }}
    />
  );
};
export { UpdateStockSheetPaperSizeses };
