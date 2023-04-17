import { ICallApi, ISetState } from "./call-api.interface";

import { UpdateDoubleSidedTapeRollsStock } from "@/pages/materials/double-sided-tape-rolls/update-double-sided-tape-rolls-stock/update-double-sided-tape-rolls-stock";
import { ShowSubTableForDoubleSidedTapeRolls } from "@/pages/materials/double-sided-tape-rolls/show-sided-tape-rolls-list";
import { returnResult } from "@/utils/helpers";

const getAndSetAllDoubleSidedTapeRolls = async (
  callApi: ICallApi,
  setState?: ISetState,
  data?: any
) => {
  const result: any = await callApi(
    "GET",
    "/v1/double-sided-tape-roll/get-all",
    data
  );
  const _data = returnResult(result, undefined);
  const mapData = _data.map((size: any) => {
    return {
      code: size.code,
      name: size.name,
      weightPerSquareMeter: size.weightPerSquareMeter,
      height: size.height,
      stock: (
        <UpdateDoubleSidedTapeRollsStock
          stockValue={size.stock}
          code={size.code}
        />
      ),
      pricePerUnit: size.pricePerUnit,
      settings: <ShowSubTableForDoubleSidedTapeRolls item={size} />,
    };
  });
  if (setState) {
    setState(mapData);
  }

  return _data;
};
export { getAndSetAllDoubleSidedTapeRolls };
