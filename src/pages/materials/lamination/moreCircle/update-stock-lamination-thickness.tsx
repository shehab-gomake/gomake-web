import { useGomakeAxios } from "@/hooks";
import { useCallback, useEffect, useState } from "react";
import { GomakeTextInput } from "@/components";
import { useDebounce } from "@/utils/use-debounce";
import { IUpdateLaminationThicknessStock } from "./update-stock.interface";

const UpdateStockLaminationThickness = ({
  categoryName,
  sizeId,
  stockValue,
  thicknessId,
}: IUpdateLaminationThicknessStock) => {
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
  const updateState = useCallback(
    async (categoryName: string, sizeId: string, thicknessId: string) => {
      await callApi("POST", "/v1/applications/update-stock", {
        categoryName,
        sizeId,
        thicknessId,
        stock: finalStock,
      });
    },
    [finalStock]
  );
  useEffect(() => {
    if (finalStock && isChanged) {
      updateState(categoryName, sizeId, thicknessId);
    }
  }, [finalStock, isChanged]);
  return (
    <GomakeTextInput
      value={stock}
      onChange={onChange}
      style={{
        height: 40,
        width: 100,
      }}
    />
  );
};
export { UpdateStockLaminationThickness };
