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
export const getTempUserToken = () => {
  return getItem("temp-auth-token");
};
export const updateTokenStorage = (token: string) => {
  setItem("auth-token", token);
};
export const updateTempUserTokenStorage = (token: string) => {
  setItem("temp-auth-token", token);
};
export const removeTempUserTokenStorage = () => {
  removeItem("temp-auth-token");
};

// Refresh token functions
export const getRefreshToken = () => {
  return getItem("refresh-token");
};
export const updateRefreshTokenStorage = (refreshToken: string) => {
  setItem("refresh-token", refreshToken);
};
export const removeRefreshTokenStorage = () => {
  removeItem("refresh-token");
};

export const clearStorage = () => {
  localStorage.clear();
};

export const removeItem = (key: string) => {
  localStorage.removeItem(key);
};
