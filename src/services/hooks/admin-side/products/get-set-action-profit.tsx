import { returnResult } from "@/utils/helpers";
import { ICallApi, ISetState } from "../../call-api.interface";
import { PricingListMenuWidget } from "@/pages-components/products/profits/widgets/pricing-list/more-circle";
import { renderProfits } from "@/pages-components/products/profits/use-profit-action.";

const getAndSetActionProfitRowByActionId = async (
  callApi: ICallApi,
  setState?: ISetState,
  setActionProfitRows?: any,
  setActionProfitRowsNew?: any,
  machincesStateValue?: any,
  productsStateValue?: any,
  clientTypesStateValue?: any,
  parametersStateValue?: any,
  data?: any
) => {
  const renderType = (item: any) => {
    if (item?.machineId != null) {
      const myArry = machincesStateValue.find(
        (ele: any) => ele?.id == item.machineId
      );
      return { type: "machine", parameter: "machine", name: myArry?.name };
    } else if (item?.subProductId != null) {
      const myArry = productsStateValue.find(
        (ele: any) => ele?.id == item.subProductId
      );
      return { type: "product", parameter: "product", name: myArry?.name };
    } else if (item?.clientTypeId != null) {
      const myArry = clientTypesStateValue.find(
        (ele: any) => ele?.id == item.clientTypeId
      );
      return { type: "client", parameter: "client", name: myArry?.name };
    } else if (item?.priceListParameterId != null) {
      const myArry = parametersStateValue.find(
        (ele: any) => ele?.id == item.priceListParameterId
      );
      return {
        type: "parameter",
        name: `${myArry?.name} `,
        parameter: item?.paramValueName,
      };
    }
  };
  const result: any = await callApi(
    "GET",
    `/v1/printhouse-config/profits/get-action-profit-by-action-id`,
    data,
    false
  );
  const _data: any = returnResult(result, undefined);
  const mapData = _data?.actionProfitRows?.map((item: any) => {
    return {
      ...renderProfits(item),
      more: <PricingListMenuWidget item={item} />,
      id: item?.id,
      recordID: item?.recordID,
    };
  });
  const actionProfitRowsMapping = _data?.actionProfitRows?.map((item: any) => {
    return {
      ...renderProfits(item),
      more: <PricingListMenuWidget item={item} />,
      id: item?.id,
      recordID: item?.recordID,
    };
  });
  const mapActionExpections = _data?.actionExpections?.map((item: any) => {
    return {
      ...renderType(item),
      exceptionType:
        item?.exceptionType === 0
          ? `Additional(${item?.additionalProfit})`
          : item?.exceptionType === 1
          ? "NewBase"
          : "EditBase",
      id: item?.id,
      recordID: item?.recordID,
      item,
      selectedAdditional: item?.additionalProfit,
      exceptionTypeValue:
        item?.exceptionType === 0
          ? `Additional`
          : item?.exceptionType === 1
          ? "NewBase"
          : "EditBase",
    };
  });
  setActionProfitRows(mapData);
  setActionProfitRowsNew(actionProfitRowsMapping);
  _data.actionProfitRowsMapped = mapData;
  _data.actionExpectionRowsMapped = mapActionExpections;
  if (setState) {
    setState(_data);
  }

  return _data;
};

export { getAndSetActionProfitRowByActionId };
