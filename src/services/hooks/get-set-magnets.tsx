import { ICallApi, ISetState } from "./call-api.interface";

import { UpdateMagnetsStock } from "@/pages/materials/magnets/update-magnets-stock/update-magnets-stock";
import { ShowSubTableForMagnets } from "@/pages/materials/magnets/show-magnets-list";
import { returnResult } from "@/utils/helpers";
import { ColoredCycle } from "@/components";

const getAndSetAllMagnets = async (
  callApi: ICallApi,
  setState?: ISetState,
  data?: any
) => {
  const result: any = await callApi("GET", "/v1/magnets/get-all", data);
  const _data = returnResult(result, undefined);
  const mapData = _data.map((size: any) => {
    return {
      code: size.code,
      name: size.name,
      weight: size.weight,
      withGlue: size.withGlue ? (
        <ColoredCycle backgroundColor={"green"} />
      ) : (
        <ColoredCycle backgroundColor={"red"} />
      ),
      directPrinting: size.directPrinting ? (
        <ColoredCycle backgroundColor={"green"} />
      ) : (
        <ColoredCycle backgroundColor={"red"} />
      ),
      height: size.height,
      width: size.width,
      stock: <UpdateMagnetsStock stockValue={size.stock} code={size.code} />,
      price: size.price,
      settings: <ShowSubTableForMagnets item={size} />,
    };
  });
  if (setState) {
    setState(mapData);
  }

  return _data;
};
export { getAndSetAllMagnets };
