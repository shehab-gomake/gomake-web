const STORAGE_KEYS = {
  printHouseId: 'printhouseid',
  printHouseHost: 'printHouseId'
};
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

export const updateTokenStorage = (token: string) => {
  setItem("auth-token", token);
};

export const clearStorage = () => {
  localStorage.clear();
};

export const getPrintHouseId = () => {
  return getItem(STORAGE_KEYS.printHouseId);
};

export const getPrintHouseHost = () => {
  return getItem(STORAGE_KEYS.printHouseHost);
};

export const updatePrintHouseIdHost = (id: string, host: string) => {
  setItem(STORAGE_KEYS.printHouseId, id);
  setItem(STORAGE_KEYS.printHouseHost, host);
}