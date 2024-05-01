import { ICallAndSetData } from "@/services/api-service/interface";
import { EHttpMethod } from "@/services/api-service/enums";
import { getSetApiData } from "@/services/api-service/get-set-api-data";


const generateCalculateProductsExcelForPrintHousesApi: ICallAndSetData = async (callApi, setState , data:{printHouseId?:string} ) => {
  return  await getSetApiData(callApi, EHttpMethod.GET, "/v1/printhouse-config/products/generate-calculate-products-excel-for-print-houses", setState,data)
}

export { generateCalculateProductsExcelForPrintHousesApi };
