import { returnResult } from "@/utils/helpers";
import {ICallApi, ISetState} from "@/services/api-service/interface";
import {EHttpMethod} from "@/services/api-service/enums";


const getSetApiData = async (
  callApi: ICallApi,
  method: EHttpMethod,
  url: string,
  setState?: ISetState,
  data?: any,

) => {
  const result: any = await callApi(
    method,
    url,
    data
  );
  const _data = returnResult(result, setState);

  return {success: !!result.success, data: _data};
};

export { getSetApiData };
