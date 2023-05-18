import { returnResult } from "@/utils/helpers";
import { ICallApi, ISetState } from "../../call-api.interface";
import { IconButton } from "@mui/material";
import { MoreCircleIcon } from "@/icons";
import { PricingListMenuWidget } from "@/pages/admin/products/profits/widgets/pricing-list/more-circle";

const getAndSetActionProfitRowByActionId = async (
  callApi: ICallApi,
  setState?: ISetState,
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
      return { type: "machine", name: myArry?.name };
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
      more: <PricingListMenuWidget item={item} />,
      id: item?.id,
    };
  });
  const mapActionExpections = _data?.actionExpections?.map((item: any) => {
    return {
      ...renderType(item),
      exceptionType:
        item?.exceptionType === 0
          ? `Additional (${item?.additionalProfit})`
          : "NewBase",
      id: item?.id,
    };
  });
  _data.actionProfitRowsMapped = mapData;
  _data.actionExpectionRowsMapped = mapActionExpections;
  if (setState) {
    setState(_data);
  }

  return _data;
};

export { getAndSetActionProfitRowByActionId };
