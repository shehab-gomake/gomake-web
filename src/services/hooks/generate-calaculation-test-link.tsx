import { returnResult } from "@/utils/helpers";

import { ICallApi, ISetState } from "./call-api.interface";

const generateCalaculationTestLink = async (
  callApi: ICallApi,
  setState?: ISetState,
  data?: any
) => {
  const result: any = await callApi(
    "GET",
    "/v1/printhouse-config/profits/generate-calaculation-test-link",
    data
  );
  const _data = returnResult(result, undefined);
  if (setState) {
    setState(_data);
  }

  return _data;
};

export { generateCalaculationTestLink };
