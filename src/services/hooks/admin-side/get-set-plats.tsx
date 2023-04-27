import { returnResult } from "@/utils/helpers";
import { ICallApi, ISetState } from "../call-api.interface";
import { SheetSettingsWidget } from "@/pages/admin/materials/sheets/more-circle";

const getAndSetGetAllPlats = async (
  callApi: ICallApi,
  setState?: ISetState,
  data?: any
) => {
  const result: any = await callApi(
    "GET",
    "/v1/administrator/plat/get-all",
    data
  );
  const _data = returnResult(result, undefined);
  const mapData = _data.map((item: any) => {
    return {
      categoryName: item?.categoryName,
      settings: <SheetSettingsWidget item={item} />,
    };
  });
  if (setState) {
    setState(mapData);
  }

  return _data;
};

export { getAndSetGetAllPlats };
