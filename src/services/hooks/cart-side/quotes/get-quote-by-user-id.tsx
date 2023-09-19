import { returnResult } from "@/utils/helpers";
import { ICallApi, ISetState } from "../../call-api.interface";
import { MoreMenuWidget } from "@/widgets/quote/more-circle";

const getAndSetQuotesByUserId = async (
  callApi: ICallApi,
  setState?: ISetState,
  data?: any
) => {
  const result: any = await callApi(
    "GET",
    "/v1/erp-service/quote/get-quotes-by-user-id",
    data
  );

  const _data: any = returnResult(result, undefined);
  const mapData = _data?.priceListItems?.map((item: any, index: number) => {
    return {
      id: index + 1,
      itemName: item?.subProduct?.name,
      details: (
        <div style={{ height: 36, overflowY: "scroll" }}>{item?.content}</div>
      ),
      amount: item?.quantity,
      unitPrice: item?.price,
      discount: item?.discount,
      finalPrice: item?.finalPrice,
      more: <MoreMenuWidget />,
      quoteItemId: item?.id,
    };
  });
  _data.priceListItemsMapping = mapData;
  if (setState) {
    setState(_data);
  }

  return _data;
};

export { getAndSetQuotesByUserId };
