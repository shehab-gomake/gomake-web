import { returnResult } from "@/utils/helpers";
import { ICallApi, ISetState } from "../call-api.interface";
import { EnvelopsSettingsWidget } from "@/pages/admin/materials/envelope/more-circle";

const getAndSetGetAllEnvelope = async (
  callApi: ICallApi,
  setState?: ISetState,
  data?: any
) => {
  const result: any = await callApi(
    "GET",
    "/v1/administrator/envelopes/get-all",
    data
  );
  const _data = returnResult(result, undefined);
  const mapData = _data.map((item: any) => {
    return {
      categoryName: item?.categoryName,
      settings: <EnvelopsSettingsWidget item={item} />,
    };
  });
  if (setState) {
    setState(mapData);
  }

  return _data;
};

export { getAndSetGetAllEnvelope };
