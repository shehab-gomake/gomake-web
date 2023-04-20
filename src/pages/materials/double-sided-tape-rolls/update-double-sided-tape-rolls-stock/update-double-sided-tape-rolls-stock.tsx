import { useCallback, useEffect, useState } from "react";

import { useGomakeAxios } from "@/hooks";
import { GomakeTextInput } from "@/components";
import { useDebounce } from "@/utils/use-debounce";

import { IUpdateDoubleSidedTapeRollsStock } from "./update-double-sided-tape-rolls.interface";

const UpdateDoubleSidedTapeRollsStock = ({
  stockValue,
  code,
}: IUpdateDoubleSidedTapeRollsStock) => {
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
    await callApi("POST", "/v1/double-sided-tape-roll/update-stock", {
      stock: finalStock,
      code,
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
export { UpdateDoubleSidedTapeRollsStock };
