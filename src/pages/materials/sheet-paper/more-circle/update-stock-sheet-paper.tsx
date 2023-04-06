import { useGomakeAxios } from "@/hooks";
import { useCallback, useEffect, useState } from "react";
import { GomakeTextInput } from "@/components";
import { useDebounce } from "@/utils/use-debounce";
import { IUpdateSheetPaperSizesStock } from "./update-stock.interface";

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
      await callApi("POST", "/v1/sheets/update-stock", {
        categoryName,
        sizeId,
        weightId,
        stock: finalStock,
      });
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
        height: 40,
        width: 100,
      }}
    />
  );
};
export { UpdateStockSheetPaperSizeses };
