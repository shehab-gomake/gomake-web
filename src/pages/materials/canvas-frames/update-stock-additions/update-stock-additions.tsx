import { useCallback, useEffect, useState } from "react";

import { useGomakeAxios } from "@/hooks";
import { GomakeTextInput } from "@/components";
import { useDebounce } from "@/utils/use-debounce";

import { IUpdateCanvasFramesStock } from "./update-additions.interface";

const UpdateStockCanvasFrames = ({
  code,
  stockValue,
  categoryName,
  sizeId,
}: IUpdateCanvasFramesStock) => {
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
    async (code: string) => {
      await callApi("POST", "/v1/canvas-frames/update-stock", {
        code,
        stock: finalStock,
        categoryName,
        sizeId,
      });
    },
    [finalStock]
  );
  useEffect(() => {
    if (finalStock && isChanged) {
      updateStock(code);
    }
  }, [finalStock, isChanged, code, stockValue]);
  useEffect(() => {
    setStock(stockValue);
  }, [stockValue]);

  return (
    <GomakeTextInput
      key={code}
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
export { UpdateStockCanvasFrames };
