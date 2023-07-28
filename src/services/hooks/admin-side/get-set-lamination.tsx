import { returnResult } from "@/utils/helpers";
import { ICallApi, ISetState } from "../call-api.interface";
import { LaminationSettingsWidget } from "@/pages/admin/materials/lamination/more-circle";
import { LaminationSettingsNewWidget } from "@/pages/admin/materials-new/lamination/more-circle";

const getAndSetGetAllLaminations = async (
  callApi: ICallApi,
  setState?: ISetState,
  data?: any
) => {
  const result: any = await callApi(
    "GET",
    "/v1/administrator/lamination/get-all",
    data
  );
  const _data = returnResult(result, undefined);
  const mapData = _data.map((item: any) => {
    return {
      categoryName: item?.categoryName,
      settings: <LaminationSettingsWidget item={item} />,
    };
  });
  if (setState) {
    setState(mapData);
  }

  return _data;
};

const getAndSetGetAllNewLaminations = async (
  callApi: ICallApi,
  setState?: ISetState,
  data?: any
) => {
  const result: any = await callApi(
    "GET",
    "/v1/administrator/lamination/get-all",
    data
  );
  const _data = returnResult(result, undefined);
  const mapData = _data.map((item: any) => {
    return {
      categoryName: item?.categoryName,
      settings: <LaminationSettingsNewWidget item={item} />,
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
    "/v1/administrator/lamination/get-lamination",
    data
  );
  const _data = returnResult(result, undefined);

  if (setState) {
    setState(_data);
  }

  return _data;
};

export {
  getAndSetGetAllLaminations,
  getAndSetGetAllNewLaminations,
  getAndSetCategory,
};
