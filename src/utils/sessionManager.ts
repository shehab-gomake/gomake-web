import { getItem, removeItem, setItem } from "@/services/storage-data";

export const getSessionData = () => {
  return JSON.parse(getItem("sessionData") || "[]");
};

export const addRequestToSession = (request: any) => {
  const sessionData = getSessionData();
  sessionData.push(request);
  if (sessionData.length > 10) {
    sessionData.shift(); // Remove the oldest request
  }
  setItem("sessionData", JSON.stringify(sessionData));
};

export const clearSessionData = () => {
  removeItem("sessionData");
};

export const logSessionData = () => {
  const sessionData = getSessionData();
  console.log("Session data:", sessionData);
};
