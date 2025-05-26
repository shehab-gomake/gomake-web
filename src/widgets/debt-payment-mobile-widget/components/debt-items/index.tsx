import { quoteConfirmationState } from "@/store";
import { useRecoilValue } from "recoil";
import { DebtCard } from "./quote-card";

const DebtItems = () => {
  const quoteConfirm = useRecoilValue<any>(quoteConfirmationState);

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      {quoteConfirm?.debtsToPay?.map((item: any, index: number) => {
        return (
          <DebtCard
            key={item?.transId}
            item={item}
            index={index}
            isCanSelectRows={quoteConfirm?.isCanSelectRows}
          />
        );
      })}
    </div>
  );
};

export { DebtItems };
