import { returnResult } from "@/utils/helpers";
import { ICallApi, ISetState } from "../../call-api.interface";
import { ProductTestListMoreCircleWidget } from "@/pages/admin/products/profits/widgets/pricing-list/product-list-more-circle";

const getAndSetGetAllTestProductsByActionId = async (
  callApi: ICallApi,
  setState?: ISetState,
  productsStateValue?: any,
  data?: any
) => {
  console.log("productsStateValue", productsStateValue);
  const renderProduct = (testProductItemId: any) => {
    const myArry = productsStateValue.find(
      (product: any) => product?.id == testProductItemId
    );
    return { name: myArry?.name, id: myArry?.id };
  };
  const result: any = await callApi(
    "GET",
    "/v1/printhouse-config/products/get-test-product-by-action-id",
    data
  );
  const _data = returnResult(result, undefined);
  console.log("_data_data_data_data", _data);
  const mapData = _data.map((item: any) => {
    return {
      ...renderProduct(item),
      more: <ProductTestListMoreCircleWidget item={renderProduct(item)} />,
    };
  });
  if (setState) {
    setState(mapData);
  }

  return _data;
};

export { getAndSetGetAllTestProductsByActionId };
