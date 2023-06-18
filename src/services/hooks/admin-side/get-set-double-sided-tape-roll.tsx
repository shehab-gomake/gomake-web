import { returnResult } from "@/utils/helpers";
import { ICallApi, ISetState } from "../call-api.interface";
import { DoubleSidedTapeRollSettingsWidget } from "@/pages/admin/materials/double-sided-tape-roll/more-circle";

const getAndSetGetAllDoubleSidedTapeRoll = async (
  callApi: ICallApi,
  setState?: ISetState,
  data?: any
) => {
  const result: any = await callApi(
    "GET",
    "/v1/administrator/double-sided-tape-rolls/get-all-double-sided-tape-rolls",
    data
  );
  const _data = returnResult(result, undefined);
  const mapData = _data.map((item: any) => {
    return {
      name: item?.name,
      settings: <DoubleSidedTapeRollSettingsWidget item={item} />,
    };
  });
  if (setState) {
    setState(mapData);
  }

  return _data;
};

export { getAndSetGetAllDoubleSidedTapeRoll };
