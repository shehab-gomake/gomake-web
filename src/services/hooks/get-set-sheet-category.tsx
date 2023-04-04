import { returnResult } from "@/utils/helpers";
import { ICallApi, ISetState } from "./call-api.interface";
import { SheetPageMoreCircle } from "@/pages/materials/sheet-paper/more-circle";

const getAndSetSheetCategory = async (
  callApi: ICallApi,
  setState?: ISetState,
  data?: any
) => {
  const result: any = await callApi("GET", "/v1/sheets/get-categories", data);
  return returnResult(result, setState);
};

const getAndSetSheetWeights = async (
  callApi: ICallApi,
  setState?: ISetState,
  data?: any
) => {
  if (data?.categoryName) {
    const result: any = await callApi("GET", "/v1/sheets/get-weights", data);
    const _data = returnResult(result, undefined);
    const mapData = _data.map((item: any) => {
      return {
        weight: item?.weight,
        thickness: item?.thickness,
        pricePerTon: item?.pricePerTon,
        settings: <SheetPageMoreCircle item={item} />,
      };
    });
    if (setState) {
      setState(mapData);
    }

    return _data;
  }
};

export { getAndSetSheetCategory, getAndSetSheetWeights };
