import { useCallback, useEffect, useState } from "react";

import { useGomakeAxios } from "@/hooks";
import { GomakeTextInput } from "@/components";
import { useDebounce } from "@/utils/use-debounce";

import { IUpdateStockFrames } from "./update-frames.interface";

const UpdateFramesStock = ({
  stockValue,
  categoryName,
  sizeId,
}: IUpdateStockFrames) => {
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
  const updateStock = useCallback(async () => {
    await callApi("POST", "/v1/frames/update-stock", {
      stock: finalStock,
      categoryName,
      sizeId,
    });
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
      key={categoryName}
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
export { UpdateFramesStock };
