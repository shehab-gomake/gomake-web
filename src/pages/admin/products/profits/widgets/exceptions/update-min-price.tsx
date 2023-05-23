import { useCallback, useEffect, useState } from "react";

import { useDebounce } from "@/utils/use-debounce";
import { GomakeTextInput } from "@/components";
import { useRecoilValue } from "recoil";
import { profitsState } from "../../store/profits";
import { actionProfitLists } from "@/store";

const UpdateMinPrice = () => {
  const profitsStateValue = useRecoilValue<any>(profitsState);
  const actionProfits = useRecoilValue<any>(actionProfitLists);
  const [minPrice, setMinPrice] = useState(actionProfits?.minPrice || " ");
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
    profitsStateValue?.updateActionProfitMinPrice(finalMinPrice);
    setIsChanged(false);
  }, [finalMinPrice]);

  useEffect(() => {
    if (finalMinPrice && isChanged) {
      updateMinPrice();
    }
  }, [finalMinPrice, isChanged, actionProfits]);

  useEffect(() => {
    setMinPrice(actionProfits?.minPrice);
  }, [actionProfits]);

  return (
    <GomakeTextInput
      value={minPrice || 0}
      type={"number"}
      onChange={onChange}
      key={`update-${actionProfits?.id}`}
      style={{
        height: 40,
        width: 100,
      }}
    />
  );
};
export { UpdateMinPrice };
