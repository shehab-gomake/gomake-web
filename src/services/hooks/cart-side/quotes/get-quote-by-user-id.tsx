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
    const _childsQuoteItemsMapping=item?.childsQuoteItems?.map((child: any, index2: number) =>{
      return {
        id: index2 + 1,
        amount: child?.quantity,
        unitPrice: child?.price,
        discount: child?.discount,
        finalPrice: child?.finalPrice,
        more: <MoreMenuWidget quoteItem={child} />,
        // more: "ddd",
        quoteItemId: child?.id,
      };
    })
    return {
      id: index + 1,
      itemName: item?.productName,
      details: (
        <div style={_childsQuoteItemsMapping!=null?{ height: "100%", overflowY: "scroll",paddingRight:5}:{ height: 36, overflowY: "scroll",paddingRight:5}}>{item?.content}</div>
      ),
      amount: item?.quantity,
      unitPrice: item?.price,
      discount: item?.discount,
      finalPrice: item?.finalPrice,
      more: <MoreMenuWidget quoteItem={item} />,
      quoteItemId: item?.id,
      childsQuoteItems:_childsQuoteItemsMapping
    };
  });
  _data.priceListItemsMapping = mapData;
  if (setState) {
    setState(_data);
  }

  return _data;
};

export { getAndSetQuotesByUserId };
