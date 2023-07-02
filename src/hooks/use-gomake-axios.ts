import apiRequest from "@/services/api-request";
import { loadgingState } from "@/store/loading";
import { useCallback } from "react";
import { useSetRecoilState } from "recoil";
// import { useRecoilState } from "recoil";
// import { loadgingState } from "../atoms";

// examplet to how its work
// const {callApi} = useGomakeAxios()
//const result = await callApi("POST","/v1/api/",{
//    "name":"test",
//    "age":20
// })

const useGomakeAxios = () => {
  const setLoading = useSetRecoilState(loadgingState);
  const callApi = useCallback(
    async (method: string, url: string, data?: any, lockScreen = true) => {
      if (lockScreen) {
        setLoading(true);
      }
      const result = await apiRequest(method, url, data);
      if (lockScreen) {
        setTimeout(() => {
          setLoading(false);
        }, 500);
      }
      return result;
    },
    []
  );
  const lockScreen = async (ms: number) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, ms);
  };
  return { callApi, lockScreen };
};

export { useGomakeAxios };
