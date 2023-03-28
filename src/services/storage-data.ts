export const hasToken = () => {
  if (getUserToken()) return true;
  return false;
};
export const getItem = (key: string, parse = false) => {
  if (typeof localStorage !== "undefined") {
    let item: any = null;
    item = localStorage.getItem(key);
    if (parse) {
      return JSON.parse(item);
    }
    return item;
  }
};

export const setItem = (key: string, value: any) => {
  localStorage.setItem(key, value);
};
export const getUserToken = () => {
  return getItem("auth-token");
};
export const getPrintHouseId = () => {
  return getItem("printhouseid");
};
export const updateTokenStorage = (token: string) => {
  setItem("auth-token", token);
};

export const clearStorage = () => {
  localStorage.clear();
};
