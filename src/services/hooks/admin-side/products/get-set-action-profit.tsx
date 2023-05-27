import { returnResult } from "@/utils/helpers";
import { ICallApi, ISetState } from "../../call-api.interface";
import { PricingListMenuWidget } from "@/pages/admin/products/profits/widgets/pricing-list/more-circle";

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
      return { type: "product", name: myArry?.name };
    } else if (item?.clientTypeId != null) {
      const myArry = clientTypesStateValue.find(
        (ele: any) => ele?.id == item.clientTypeId
      );
      return { type: "client", name: myArry?.name };
    } else if (item?.priceListParameterId != null) {
      const myArry = parametersStateValue.find(
        (ele: any) => ele?.id == item.priceListParameterId
      );
      return {
        type: "parameter",
        name: `${myArry?.name} - ${item?.paramValueName}`,
      };
    }
  };
  const result: any = await callApi(
    "GET",
    `/v1/printhouse-config/profits/get-action-profit-by-action-id`,
    data
  );
  const _data: any = returnResult(result, undefined);
  const mapData = _data?.actionProfitRows?.map((item: any) => {
    return {
      // ...(_data?.pricingBy === 1
      //   ? {
      //       width: item?.width,
      //       height: item?.height,
      //     }
      //   : { quantity: item?.quantity }),
      cost: item?.cost || "0",
      profit: item?.profit || "0",
      testQuantity: item?.quantity || "0",
      unitPrice: item?.unitPrice || "0",
      totalPrice: item?.totalPrice || "0",
      testFinalPrice: item?.testFinalPrice || "0",
      more: <PricingListMenuWidget item={item} />,
      id: item?.id,
    };
  });
  const actionProfitRowsMapping = _data?.actionProfitRows?.map((item: any) => {
    return {
      cost: item?.cost,
      profit: item?.profit,
      quantity: item?.quantity || 100,
      unitPrice: 0,
      totalPrice: item?.cost * (item?.profit / 100),
      testFinalPrice: 0,
      // id: item?.id,
    };
  });
  const mapActionExpections = _data?.actionExpections?.map((item: any) => {
    return {
      ...renderType(item),
      exceptionType:
        item?.exceptionType === 0
          ? `Additional (${item?.additionalProfit})`
          : item?.exceptionType === 1
          ? "NewBase"
          : "EditBase",
      id: item?.id,
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
