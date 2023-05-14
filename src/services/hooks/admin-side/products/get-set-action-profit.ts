import { returnResult } from "@/utils/helpers";
import { ICallApi, ISetState } from "../../call-api.interface";

const getAndSetActionProfitRowByActionId = async (
  callApi: ICallApi,
  setState?: ISetState,
  data?: any
) => {
  const result: any = await callApi(
    "GET",
    `/v1/printhouse-config/profits/get-action-profit-by-action-id`,
    data
  );
  // return returnResult(result, setState);
  const _data: any = returnResult(result, undefined);
  console.log("_data", _data);
  const mapData = _data?.actionProfitRows?.map((item: any) => {
    return {
      ...(_data?.pricingBy === 1
        ? {
            width: item?.width,
            height: item?.height,
          }
        : { quantity: item?.quantity }),

      cost: item?.cost,
      profit: item?.profit,
      meterPrice: item?.meterPrice,
      expMeter: item?.expMeter,
      price: item?.price,
      totalPrice: item?.totalPrice,
      more: "More",
    };
  });
  if (setState) {
    setState(mapData);
  }

  return _data;
};

export { getAndSetActionProfitRowByActionId };
