import { returnResult } from "@/utils/helpers";
import { ICallApi, ISetState } from "../../call-api.interface";
import { PricingListMenuWidget } from "@/pages/admin/products/profits/widgets/pricing-list/more-circle";
import { renderProfits } from "@/pages/admin/products/profits/use-profit-action.";

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
  const mapData = await getAndSetPricingListTableRows(callApi, setState, data);
  setSelectTestData({ unitPrice: mapData[0]?.unitPrice });
  if (setState) {
    setState(mapData);
  }

  return _data;
};

const getAndSetPricingListTableRows = async (
  callApi: ICallApi,
  setState?: ISetState,
  data?: any
) => {
  console.log("datadatadatadatadata", data);
  const result: any = await callApi(
    "GET",
    `/v1/printhouse-config/profits/get-pricing-table-rows`,
    data
  );
  const _data: any = returnResult(result, undefined);

  const mapData = _data?.map((item: any) => {
    return {
      ...renderProfits(item),
      more: <PricingListMenuWidget item={item} />,
      id: item?.id,
      recordID: item?.recordID,
    };
  });
  if (setState) {
    setState(mapData);
  }

  return mapData;
};

export {
  getAndSetGetActionProfitTestResultsByActionId,
  getAndSetPricingListTableRows,
};
