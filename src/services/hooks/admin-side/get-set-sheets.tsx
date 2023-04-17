import { returnResult } from "@/utils/helpers";
import { ICallApi, ISetState } from "../call-api.interface";
import { SheetPageMoreCircle } from "@/pages/admin/materials/sheets/more-circle";

const getAndSetGetAllSheets = async (
  callApi: ICallApi,
  setState?: ISetState,
  data?: any
) => {
  const result: any = await callApi(
    "GET",
    "/v1/administrator/sheet/get-all",
    data
  );
  const _data = returnResult(result, undefined);
  const mapData = _data.map((item: any) => {
    return {
      categoryName: item?.categoryName,
      settings: <SheetPageMoreCircle item={item} />,
    };
  });
  if (setState) {
    setState(mapData);
  }

  return _data;
};

export { getAndSetGetAllSheets };
