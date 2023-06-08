import { returnResult } from "@/utils/helpers";
import { ICallApi, ISetState } from "../call-api.interface";
import { SheetSettingsWidget } from "@/pages/admin/materials/sheets/more-circle";
import { RollEncapsulationSettingsWidget } from "@/pages/admin/materials/roll-encapsulation/more-circle";

const getAndSetGetAllRollEncapsulation = async (
  callApi: ICallApi,
  setState?: ISetState,
  data?: any
) => {
  const result: any = await callApi(
    "GET",
    "/v1/administrator/roll-encapsulation/get-all",
    data
  );
  const _data = returnResult(result, undefined);
  const mapData = _data.map((item: any) => {
    return {
      categoryName: item?.categoryName,
      settings: <RollEncapsulationSettingsWidget item={item} />,
    };
  });
  if (setState) {
    setState(mapData);
  }

  return _data;
};

export { getAndSetGetAllRollEncapsulation };
