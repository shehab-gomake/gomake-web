import { returnResult } from "@/utils/helpers";
import { ICallApi, ISetState } from "../call-api.interface";
import { MaterialRollPrintingSettingsWidget } from "@/pages/admin/materials/material-roll-printing/more-circle";

const getAndSetGetAllMaterialRollPrinting = async (
  callApi: ICallApi,
  setState?: ISetState,
  data?: any
) => {
  const result: any = await callApi(
    "GET",
    "/v1/administrator/material-roll-printing/get-all",
    data
  );
  const _data = returnResult(result, undefined);
  const mapData = _data.map((item: any) => {
    return {
      categoryName: item?.categoryName,
      settings: <MaterialRollPrintingSettingsWidget item={item} />,
    };
  });
  if (setState) {
    setState(mapData);
  }

  return _data;
};

export { getAndSetGetAllMaterialRollPrinting };
