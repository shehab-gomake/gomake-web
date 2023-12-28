import { returnResult } from "@/utils/helpers";
import { ICallApi, ISetState } from "../../call-api.interface";
import { MoreMenuWidget } from "@/widgets/quote/more-circle";
import { MoreMenuWidgetWithChilds } from "@/widgets/quote/more-circle-with-childs";
const getAndSetQuotesByUserId = async (
  callApi: ICallApi,
  setState?: ISetState,
  data?: any
) => {
  let indexs = 0;
  const result: any = await callApi(
    "GET",
    "/v1/erp-service/quote/get-quotes-by-user-id",
    data
  );

  const _data: any = returnResult(result, undefined);
  const mapData = _data?.documentItems?.map((item: any, index: number) => {
    indexs++;
    const parentIndex = indexs;
    const _childsDocumentItemsMapping = item?.childsDocumentItems?.map(
      (child: any, index2: number) => {
        indexs++;
        return {
          id: indexs,
          amount: child?.quantity,
          unitPrice: child?.price,
          discount: child?.discount,
          finalPrice: child?.finalPrice,
          // more: <MoreMenuWidgetWithChilds quoteItem={child} />,
          quoteItemId: child?.id,
        };
      }
    );
    return {
      id: parentIndex,
      itemName: item?.productName,
      details: (
        <div
          style={
            _childsDocumentItemsMapping != null
              ? { height: "100%", overflowY: "scroll", paddingRight: 5 }
              : { height: 36, overflowY: "scroll", paddingRight: 5 }
          }
        >
          {item?.content}
        </div>
      ),
      amount: item?.quantity,
      unitPrice: item?.price,
      discount: item?.discount,
      finalPrice: item?.finalPrice,
      // more: <MoreMenuWidget quoteItem={item} />,
      quoteItemId: item?.id,
      childsDocumentItems: _childsDocumentItemsMapping,
    };
  });
  _data.documentItemsMapping = mapData;
  if (setState) {
    setState(_data);
  }

  return _data;
};

export { getAndSetQuotesByUserId };
