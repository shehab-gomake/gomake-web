import { returnResult } from "@/utils/helpers";
import { ICallApi, ISetState } from "../call-api.interface";
import { GanvasFramesSettingsWidget } from "@/pages/admin/materials/canvans-frames/more-circle";

const getAndSetGetAllGanvasFrames = async (
  callApi: ICallApi,
  setState?: ISetState,
  data?: any
) => {
  const result: any = await callApi(
    "GET",
    "/v1/administrator/canvas-frames/get-all-canvas-frames",
    data
  );
  const _data = returnResult(result, undefined);
  const mapData = _data.map((item: any) => {
    return {
      categoryName: item?.categoryName,
      settings: <GanvasFramesSettingsWidget item={item} />,
    };
  });
  if (setState) {
    setState(mapData);
  }

  return _data;
};

export { getAndSetGetAllGanvasFrames };
