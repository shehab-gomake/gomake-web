import { ICallAndSetData } from "@/services/api-service/interface";
import { EHttpMethod } from "@/services/api-service/enums";
import { getSetApiData } from "@/services/api-service/get-set-api-data";

// const GenerateCalculateProductsExcelForPrintHouses = async (
//   callApi: ICallApi,
//   setState?: ISetState,
//   data?: any
// ) => {
//   const result: any = await callApi(
//     "GET",
//     "/v1/printhouse-config/products/generate-calculate-products-excel-for-print-houses",
//     data
//   );
//   return returnResult(result, setState);
// };
const GenerateCalculateProductsExcelForPrintHouses: ICallAndSetData = async (callApi, setState , data ) => {
  return  await getSetApiData(callApi, EHttpMethod.GET, "/v1/printhouse-config/products/generate-calculate-products-excel-for-print-houses", setState,data)
}

export { GenerateCalculateProductsExcelForPrintHouses };
