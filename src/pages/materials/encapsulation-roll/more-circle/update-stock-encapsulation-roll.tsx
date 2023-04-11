import { useCallback, useEffect, useState } from "react";

import { useDebounce } from "@/utils/use-debounce";
import { GomakeTextInput } from "@/components";
import { useGomakeAxios } from "@/hooks";

import { IUpdateEncapsulationStock } from "./update-stock.interface";

const UpdateStockEncapsulationRoll = ({
  categoryName,
  sizeId,
  stockValue,
  thicknessId,
}: IUpdateEncapsulationStock) => {
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
    async (categoryName: string, sizeId: string, thicknessId: string) => {
      await callApi("POST", "/v1/roll-encapsulations/update-stock", {
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
      updateStock(categoryName, sizeId, thicknessId);
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
export { UpdateStockEncapsulationRoll };
