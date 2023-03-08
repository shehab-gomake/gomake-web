import { atom } from "recoil";

export const storeNameState = atom({
  key: "storeNameState", // unique ID (with respect to other atoms/selectors)
  default: "defaultValue", // default value (aka initial value)
});

// const setStoreNameValue = useSetRecoilState(storeNameState)
// const storeNameValue = useRecoilValue(storeNameState)
// const [storeNameValue,setStoreNameValue] = useRecoilState(storeNameState)
