import { returnResult } from "@/utils/helpers";
import { ICallApi, ISetState } from "./call-api.interface";

const getAndSetCurrency= async (
    callApi: ICallApi,
    setState?: ISetState,
    data?: any
  ) => {
    const result: any = await callApi("GET", "/v1/enum/get-enums/currency", data);
    const _data = returnResult(result, undefined);
    const mapData = _data.map((currency: any) => {
      return {
      id: currency.value,
      label: currency.text
  };});
    if (setState) {
      setState(mapData);
    }
    return _data;
  };

export {
    getAndSetCurrency
};
