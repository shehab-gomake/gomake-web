import { useEffect, useState } from "react";
import lodashClonedeep from "lodash.clonedeep";

const useCustomTable = ({ data }) => {
  const [items, setItems] = useState<any>([]);
  const [itemsChilds, setItemsChilds] = useState([]);
  const changeItems = (index: number, filedName: string, value: any) => {
    console.log("filedName", filedName);
    console.log("index", index);
    console.log("value", value);
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
    console.log("items", items);
    let temp = lodashClonedeep(items);

    console.log("ABC", {
      temp,
      parentIndex,
      childInex,
      filedName,
      value,
    });
    temp[parentIndex].childsQuoteItems[childInex] = {
      ...temp[parentIndex].childsQuoteItems[childInex],
      [filedName]: value,
    };
    console.log("AFTER", {
      temp,
      parentIndex,
      childInex,
      filedName,
      value,
    });
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
