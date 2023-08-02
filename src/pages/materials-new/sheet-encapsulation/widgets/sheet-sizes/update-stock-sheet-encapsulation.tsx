import { useCallback, useEffect, useState } from "react";

import { useGomakeAxios, useSnackBar } from "@/hooks";
import { GomakeTextInput } from "@/components";
import { useDebounce } from "@/utils/use-debounce";

import { FONT_FAMILY } from "@/utils/font-family";
import { useTranslation } from "react-i18next";

const UpdateStockSheetEncapsulation = ({
  categoryName,
  sizeId,
  stockValue,
}: any) => {
  const { callApi } = useGomakeAxios();
  const { setSnackbarStateValue } = useSnackBar();
  const { t } = useTranslation();
  const [stock, setStock] = useState(stockValue);
  const [isChanged, setIsChanged] = useState(false);

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
  const updateStock = useCallback(
    async (categoryName: string, sizeId: string) => {
      const updated = await callApi(
        "POST",
        "/v1/sheet-encapsulation/update-stock",
        {
          categoryName,
          sizeId,
          stock: finalStock,
        }
      );
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
      updateStock(categoryName, sizeId);
    }
  }, [finalStock, isChanged, sizeId, stockValue]);
  useEffect(() => {
    setStock(stockValue);
  }, [stockValue]);

  return (
    <GomakeTextInput
      key={sizeId}
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
export { UpdateStockSheetEncapsulation };
