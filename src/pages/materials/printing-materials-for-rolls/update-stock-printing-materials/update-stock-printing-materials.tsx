import { useCallback, useEffect, useState } from "react";

import { useGomakeAxios } from "@/hooks";
import { GomakeTextInput } from "@/components";
import { useDebounce } from "@/utils/use-debounce";

import { IUpdatePrintingMaterialsStock } from "./update-stock-printing-materials.interface";

const UpdateStockPrintingMaterials = ({
  categoryName,
  sizeId,
  stockValue,
}: IUpdatePrintingMaterialsStock) => {
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
    async (categoryName: string, sizeId: string) => {
      await callApi("POST", "/v1/material-roll-printings/update-stock", {
        categoryName,
        sizeId,
        stock: finalStock,
      });
    },
    [finalStock]
  );
  useEffect(() => {
    if (finalStock && isChanged) {
      updateStock(categoryName, sizeId);
    }
  }, [finalStock, isChanged, sizeId]);
  useEffect(() => {
    setStock(stockValue);
  }, [stockValue]);

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
export { UpdateStockPrintingMaterials };
