import { returnResult } from "@/utils/helpers";
import { ICallApi, ISetState } from "../../call-api.interface";
import { PricingListMenuWidget } from "@/pages/admin/products/profits/widgets/pricing-list/more-circle";

const getAndSetActionExceptionProfitRowByActionExceptionId = async (
  callApi: ICallApi,
  setState?: ISetState,
  actionProfits?: any,
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
      // ...(actionProfits?.pricingBy === 1
      //   ? {
      //       width: item?.width,
      //       height: item?.height,
      //     }
      //   : { quantity: item?.quantity }),

      //New Display Data

      cost: item?.cost,
      profit: item?.profit,
      testQuantity: item?.testQuantity,
      testUnitPrice: item?.testUnitPrice,
      totalPrice: item?.totalPrice,
      testFinalPrice: item?.testFinalPrice,
      more: <PricingListMenuWidget item={item} />,
      id: item?.id,
    };
  });

  if (setState) {
    setState(mapData);
  }

  return _data;
};

export { getAndSetActionExceptionProfitRowByActionExceptionId };
