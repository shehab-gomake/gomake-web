import { returnResult } from "@/utils/helpers";
import { ICallApi, ISetState } from "../../call-api.interface";
import { PricingListMenuWidget } from "@/pages/admin/products/profits/widgets/pricing-list/more-circle";
import { renderProfits } from "@/pages/admin/products/profits/use-profit-action.";

const getAndSetActionExceptionProfitRowByActionExceptionId = async (
  callApi: ICallApi,
  setState?: ISetState,
  data?: any
) => {
  const result: any = await callApi(
    "GET",
    `/v1/printhouse-config/profits/get-action-exeption-profit-row-by-exeption-id`,
    data
  );
  const _data: any = returnResult(result, undefined);
  const mapData = _data?.map((item: any) => {
    return {
      ...renderProfits(item),
      // testFinalPrice: item?.testFinalPrice?.toFixed(2) || "0",
      // more: <PricingListMenuWidget item={item} />,
      id: item?.id,
      recordID: item?.recordID,
    };
  });

  if (setState) {
    setState(mapData);
  }

  return _data;
};

export { getAndSetActionExceptionProfitRowByActionExceptionId };
