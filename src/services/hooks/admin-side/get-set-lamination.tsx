import { returnResult } from "@/utils/helpers";
import { ICallApi, ISetState } from "../call-api.interface";
import { LaminationSettingsWidget } from "@/pages/admin/materials/lamination/more-circle";

const getAndSetGetAllLaminations = async (
  callApi: ICallApi,
  setState?: ISetState,
  data?: any
) => {
  const result: any = await callApi(
    "GET",
    "/v1/administrator/lamination/get-all-laminations",
    data
  );
  const _data = returnResult(result, undefined);
  const mapData = _data.map((item: any) => {
    console.log("item", item);
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

export { getAndSetGetAllLaminations };
