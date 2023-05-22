import { returnResult } from "@/utils/helpers";
import { ICallApi, ISetState } from "../../call-api.interface";
import { ProductTestListMoreCircleWidget } from "@/pages/admin/products/profits/widgets/pricing-list/product-list-more-circle";

const getAndSetGetAllTestProductsByActionId = async (
  callApi: ICallApi,
  setState?: ISetState,
  productsStateValue?: any,
  data?: any
) => {
  const renderProduct = (testProductItemId: any) => {
    const myArry = productsStateValue.find(
      (product: any) => product?.id == testProductItemId
    );
    return myArry?.name;
  };
  const result: any = await callApi(
    "GET",
    "/v1/printhouse-config/products/get-test-product-by-action-id",
    data
  );
  const _data = returnResult(result, undefined);
  const mapData = _data.map((item: any) => {
    return {
      name: renderProduct(item),
      more: <ProductTestListMoreCircleWidget item={item} />,
    };
  });
  if (setState) {
    setState(mapData);
  }

  return _data;
};

export { getAndSetGetAllTestProductsByActionId };
