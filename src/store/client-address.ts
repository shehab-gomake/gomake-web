import { atom, selector } from "recoil";

export const clientAddressState = atom({
  key: "clientAddressState",
  default: [],
});

export const addressSelectState = selector({
  key: 'FilteredTodoList',
  get: ({get}) => {
    const data = get(clientAddressState);

    const newData = [
      { label: 'add new address', value: null},
      ...data.map((item) => ({ label: item?.city, value: item?.id }))
    ];
    return newData;
  },
});