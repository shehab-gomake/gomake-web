import { useEffect, useState } from "react";
import lodashClonedeep from "lodash.clonedeep";

const useCustomTable = ({ data }) => {
  const [items, setItems] = useState<any>([]);
  const [itemsChilds, setItemsChilds] = useState([]);
  const changeItems = (index: number, filedName: string, value: any) => {
    let temp = [...items];
    temp[index] = {
      ...temp[index],
      [filedName]: value,
    };
    setItems(temp);
  };
  const changeItemsChilds = (
    parentIndex: number,
    childInex: number,
    filedName: string,
    value: any
  ) => {
    let temp = lodashClonedeep(items);
    temp[parentIndex].childsQuoteItems[childInex] = {
      ...temp[parentIndex].childsQuoteItems[childInex],
      [filedName]: value,
    };
    setItems(temp);
  };
  useEffect(() => {
    setItems(data);
  }, [data]);
  return {
    items,
    changeItems,
    changeItemsChilds,
    itemsChilds,
  };
};

export { useCustomTable };
