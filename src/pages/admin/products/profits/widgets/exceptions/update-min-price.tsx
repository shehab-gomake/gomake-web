import { useCallback, useEffect, useState } from "react";

import { useDebounce } from "@/utils/use-debounce";
import { GomakeTextInput } from "@/components";

const UpdateMinPrice = ({ minValue, profitsStateValue }: any) => {
  const [isUdate, setIsUpdate] = useState(false);
  const [minPrice, setMinPrice] = useState(minValue || 0);
  const [isChanged, setIsChanged] = useState(false);

  const debounce = useDebounce(minPrice, 500);
  const [finalMinPrice, setFinalMinPrice] = useState("");
  useEffect(() => {
    setFinalMinPrice(debounce);
  }, [debounce]);

  const onChange = useCallback(
    (e: any) => {
      setIsChanged(true);
      setMinPrice(e.target.value);
    },
    [setIsChanged]
  );
  const updateMinPrice = useCallback(async () => {
    setIsUpdate(false);
    await profitsStateValue?.updateActionProfitMinPrice(finalMinPrice);
  }, [finalMinPrice]);
  useEffect(() => {
    if (finalMinPrice && isChanged) {
      updateMinPrice();
    }
  }, [finalMinPrice, isChanged, minValue]);
  useEffect(() => {
    setMinPrice(minValue);
  }, [minValue]);

  return isUdate ? (
    <GomakeTextInput
      value={minPrice}
      type={"number"}
      onChange={onChange}
      style={{
        height: 30,
        width: 100,
      }}
      autoFocus={true}
    />
  ) : (
    <div onClick={() => setIsUpdate(true)}>{`${minPrice || 0}`}</div>
  );
};
export { UpdateMinPrice };
