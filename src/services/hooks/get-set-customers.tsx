import { returnResult } from "@/utils/helpers";
import { ICallApi, ISetState } from "./call-api.interface";


// need to change the endpoints of all the http request

const getAndSetAgentsCategores = async (
  callApi: ICallApi,
  setState?: ISetState,
  data?: any
) => {
  const result: any = await callApi(
    "GET",
    "/v1/suppliers/get-suppliers",
    data
  );
  return returnResult(result, setState);
};


const getAndSetCustomersCategores = async (
  callApi: ICallApi,
  setState?: ISetState,
  data?: any
) => {
  const result: any = await callApi(
    "GET",
    "/v1/suppliers/get-suppliers",
    data
  );
  return returnResult(result, setState);
};


// test data table
const getAndSetAllCustomers = async (
  callApi: ICallApi,
  setState?: ISetState,
  data?: any
) => {
  const result: any = await callApi("GET", "/v1/colors/get-all", data);
  const _data = returnResult(result, undefined);
  const mapData = _data.map((size: any) => {
    return {
      customerCode: size.code,
      name: size.colorName,
      volumeInLiters: size.colorName,
      customerType: size.colorName,
      agent: size.colorName,
      email: size.colorName,
      fax: size.colorName,
      mobile: size.colorName,
      phone1: size.colorName,
      phone2: size.colorName,
      status: size.colorName,
      hashTag:size.colorName,
    };
  });
  if (setState) {
    setState(mapData);
  }
  return _data;
};

export {
  getAndSetCustomersCategores,
  getAndSetAgentsCategores,
  getAndSetAllCustomers,
};
