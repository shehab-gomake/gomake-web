import { returnResult } from "@/utils/helpers";
import { ICallApi, ISetState } from "../../call-api.interface";
import { PricingListMenuWidget } from "@/pages/admin/products/profits/widgets/pricing-list/more-circle";
import { GoMakeAutoComplate } from "@/components";

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
  console.log("datadatadatadatadata", data);
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
    data
  );
  const _data: any = returnResult(result, undefined);
  const mapData = _data?.actionProfitRows?.map((item: any) => {
    const unitPrice = Number(data?.selectTestDataVal?.unitPrice || "0").toFixed(
      2
    );
    const testFinalPrice = Number(
      item?.quantity * data?.selectTestDataVal?.unitPrice
    ).toFixed(2);
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
      unitPrice,
      totalPrice: (item?.cost * (item?.profit / 100))?.toFixed(2),
      // testFinalPrice,
      // more: <PricingListMenuWidget item={item} />,
      id: item?.id,
      recordID: item?.recordID,
    };
  });
  const actionProfitRowsMapping = _data?.actionProfitRows?.map((item: any) => {
    const unitPrice = Number(data?.selectTestDataVal?.unitPrice)?.toFixed(2);
    const testFinalPrice = Number(
      item?.quantity * data?.selectTestDataVal?.unitPrice
    )?.toFixed(2);
    return {
      cost: item?.cost || "0",
      profit: item?.profit || "0",
      quantity: item?.quantity || "0",
      unitPrice,
      totalPrice: (item?.cost * (item?.profit / 100))?.toFixed(2),
      // testFinalPrice,
      // more: <PricingListMenuWidget item={item} />,
      id: item?.id,
      recordID: item?.recordID,
    };
  });
  // item?.exceptionType === 0
  //         ? `Additional (${item?.additionalProfit})`
  //         : item?.exceptionType === 1
  //         ? "NewBase"
  //         : "EditBase",
  const mapActionExpections = _data?.actionExpections?.map((item: any) => {
    return {
      ...renderType(item),
      exceptionType: (
        <GoMakeAutoComplate
          key={"item-" + item.id}
          options={[
            `Additional(${item?.additionalProfit})`,
            "NewBase",
            "EditBase",
          ]}
          // style={clasess.autoComplateStyle}
          onChange={""}
          defaultValue={
            item?.exceptionType === 0
              ? `Additional(${item?.additionalProfit})`
              : item?.exceptionType === 1
              ? "NewBase"
              : "EditBase"
          }
          disableClearable={true}
          style={{
            width: 160,
            border: 0,
            color: "#F135A3",
            marginLeft: -20,
          }}
        />
      ),
      id: item?.id,
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
