import { quoteItemState } from "@/store";
import React from "react";
import { useRecoilValue } from "recoil";
import { QuoteCard } from "./quote-card";

const QuoteItems = () => {
    const quoteStateValue = useRecoilValue<any>(quoteItemState);


  let indexs = 0;
  return (
    <div style={{display:"flex" , flexDirection:"column" , alignItems:"center"}}>
            {quoteStateValue?.documentItems?.map((item: any, index: number) => {
              indexs++;
              const parentIndex = indexs;
              return (
                  <QuoteCard
                    key={item.id} 
                    item={item}
                    index={index}
                    parentIndex={parentIndex}
                  />
                
              );
            })}
    </div>
  );
};

export { QuoteItems };