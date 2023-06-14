import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilState, useRecoilValue } from "recoil";
import { quoteState } from "../../store/quote";
import { clientContactsState, quoteItemState } from "@/store";

const useContactWidget = () => {
  const { t } = useTranslation();
  const quoteStateValue = useRecoilValue<any>(quoteState);
  const quoteItemValue: any = useRecoilValue(quoteItemState);
  const [clientContactsValue] = useRecoilState<any>(clientContactsState);
  const [items, setItems] = useState([]);
  const changeItems = (index: number, filedName: string, value: any) => {
    let temp = [...items];
    temp[index] = {
      ...temp[index],
      [filedName]: value,
    };
    setItems(temp);
  };

  useEffect(() => {
    setItems(quoteItemValue?.quoteContacts);
  }, [quoteItemValue]);

  console.log("items", items);
  return {
    quoteStateValue,
    quoteItemValue,
    clientContactsValue,
    items,
    setItems,
    changeItems,
    t,
  };
};

export { useContactWidget };
