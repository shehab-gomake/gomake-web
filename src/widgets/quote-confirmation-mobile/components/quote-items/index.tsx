import { quoteConfirmationState, quoteItemState } from "@/store";
import React from "react";
import { useRecoilValue } from "recoil";
import { QuoteCard } from "./quote-card";

const QuoteItems = () => {
  // const quoteConfirm = useRecoilValue<any>(quoteItemState);
  let indexs = 0;

  const quoteConfirm = useRecoilValue<any>(quoteConfirmationState);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      {quoteConfirm?.documentItems?.map((item: any, index: number) => {
        indexs++;
        const parentIndex = indexs;
        return (
          <>
            <QuoteCard
              key={item.id}
              item={item}
              index={index}
              parentIndex={parentIndex}
            />
            {item?.childsDocumentItems &&
              item?.childsDocumentItems?.map(
                (childItem: any, childIndex: number) => {
                  indexs++;
                  return (
                    <QuoteCard
                      key={childItem.id}
                      item={childItem}
                      index={indexs}
                      parentIndex={index}
                    />
                  );
                }
              )}
          </>
        );
      })}
    </div>
  );
};

export { QuoteItems };