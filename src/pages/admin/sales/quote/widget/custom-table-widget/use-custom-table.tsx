import { useEffect, useState } from "react";

const useCustomTable = ({ data }) => {
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
    setItems(data);
  }, [data]);
  return {
    items,
    changeItems,
  };
};

export { useCustomTable };
