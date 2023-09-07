import { quoteItemState } from "@/store";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";
import { quoteState } from "@/pages/quote/store/quote";

const useTotalPriceAndVat = () => {
  const { t } = useTranslation();
  const quoteItemValue: any = useRecoilValue(quoteItemState);
  const quoteStateValue = useRecoilValue<any>(quoteState);
  const [quoteItems, setquoteItems] = useState<any>([]);

  const changeItems = useCallback(
    (filedName: string, value: any) => {
      setquoteItems((prev) => {
        return {
          ...prev,
          [filedName]: value,
        };
      });
    },
    [quoteItems]
  );

  useEffect(() => {
    setquoteItems(quoteItemValue);
  }, [quoteItemValue]);

  const btnTabs = [
    {
      name: "Print",
      onclick: () => null,
    },
    {
      name: "save order",
      onclick: () => null,
    },
    {
      name: "Send quote",
      onclick: () => null,
    },
    {
      name: "Cancel",
      onclick: () => null,
    },
  ];
  return {
    btnTabs,
    quoteItemValue,
    quoteItems,
    quoteStateValue,
    changeItems,
    t,
  };
};

export { useTotalPriceAndVat };
