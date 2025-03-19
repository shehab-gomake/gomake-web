import { atom, selector } from "recoil";

export const clientAddressState = atom({
  key: "clientAddressState",
  default: [],
});

export const addressSelectState = selector({
  key: "FilteredTodoList",
  get: ({ get }) => {
    const data = get(clientAddressState);

    const newData = [
      { label: "add new address", value: null, type: null },
      ...data.map((item, index) => ({
        label: item?.city ?? `unKnown address - ${index}`,
        value: item?.id,
        type: item?.type,
      })),
    ];
    return newData;
  },
});
