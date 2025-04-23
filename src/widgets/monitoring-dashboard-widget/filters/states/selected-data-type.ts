import { atom } from "recoil";
import { CalculationDataTypeEnum } from "../components/fixed-data-type-component";

const selectedDataTypeState = atom<CalculationDataTypeEnum | null>({
  key: "selectedDataTypeState",
  default: null,
});

export { selectedDataTypeState };
