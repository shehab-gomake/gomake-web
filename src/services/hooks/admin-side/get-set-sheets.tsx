import { returnResult } from "@/utils/helpers";
import { ICallApi, ISetState } from "../call-api.interface";
import { SheetSettingsWidget } from "@/pages/admin/materials/sheets/more-circle";
import { SheetSettingsWidget as SheetSettingsWidgetNew } from "@/pages/admin/materials-new/sheets/more-circle";

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
      settings: <SheetSettingsWidget item={item} />,
    };
  });
  if (setState) {
    setState(mapData);
  }

  return _data;
};
const getAndSetGetAllNewSheets = async (
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
      settings: <SheetSettingsWidgetNew item={item} />,
    };
  });
  if (setState) {
    setState(mapData);
  }

  return _data;
};
const getAndSetCategory = async (
  callApi: ICallApi,
  setState?: ISetState,
  data?: any
) => {
  const result: any = await callApi(
    "GET",
    "/v1/administrator/sheet/get-sheet",
    data
  );
  const _data = returnResult(result, undefined);

  if (setState) {
    setState(_data);
  }

  return _data;
};

export { getAndSetGetAllSheets, getAndSetGetAllNewSheets, getAndSetCategory };
