import apiRequest from "@/services/api-request";
// import { useRecoilState } from "recoil";
// import { loadgingState } from "../atoms";

// examplet to how its work
// const {callApi} = useGomakeAxios()
//const result = await callApi("POST","/v1/api/",{
//    "name":"test",
//    "age":20
// })

const useGomakeAxios = () => {
  //   const [, setLoading] = useRecoilState(loadgingState);
  const callApi = async (
    method: string,
    url: string,
    data?: any,
    lockScreen = true
  ) => {
    // if (lockScreen) {
    //   setLoading(true);
    // }
    const result = await apiRequest(method, url, data);
    // if (lockScreen) {
    //   setTimeout(() => {
    //     setLoading(false);
    //   }, 500);
    // }
    return result;
  };
  const lockScreen = async (ms: number) => {
    // setLoading(true);
    // setTimeout(() => {
    //   setLoading(false);
    // }, ms);
  };
  return { callApi, lockScreen };
};

export { useGomakeAxios };
