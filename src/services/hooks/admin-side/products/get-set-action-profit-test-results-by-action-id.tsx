import { returnResult } from "@/utils/helpers";
import { ICallApi, ISetState } from "../../call-api.interface";
import { PricingListMenuWidget } from "@/pages/admin/products/profits/widgets/pricing-list/more-circle";

const getAndSetGetActionProfitTestResultsByActionId = async (
  callApi: ICallApi,
  setState?: ISetState,
  setSelectTestData?: any,
  actionProfits?: any,
  data?: any
) => {
  const result: any = await callApi(
    "GET",
    `/v1/printhouse-config/profits/action-profit-test-results-by-action-id`,
    data
  );
  const _data: any = returnResult(result, undefined);
  const mapData = _data?.map((item: any) => {
    return {
      // ...(actionProfits?.pricingBy === 1
      //   ? {
      //       width: item?.width,
      //       height: item?.height,
      //     }
      //   : { quantity: item?.quantity }),

      cost: item?.cost || "0",
      profit: item?.profit || "0",
      testQuantity: item?.quantity || "0",
      unitPrice: item?.unitPrice?.toFixed(2) || "0",
      totalPrice: item?.totalPrice?.toFixed(2) || "0",
      // testFinalPrice: item?.testFinalPrice?.toFixed(2) || "0",
      // more: <PricingListMenuWidget item={item} />,
      id: item?.id,
      recordID: item?.recordID,
    };
  });
  setSelectTestData({ unitPrice: mapData[0]?.unitPrice });
  if (setState) {
    setState(mapData);
  }

  return _data;
};

export { getAndSetGetActionProfitTestResultsByActionId };
