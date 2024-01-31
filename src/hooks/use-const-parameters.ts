import { subProductsParametersState } from "@/store";
import { getParameterByParameterCode } from "@/utils/constants";
import { useRecoilValue } from "recoil";

const useConstParameters = () => {
  const subProducts = useRecoilValue<any>(subProductsParametersState);
  
  const WidthParameter = getParameterByParameterCode(subProducts,"Width");
  const HeightParameter = getParameterByParameterCode(subProducts,"Height");
  const SizeParameter = getParameterByParameterCode(subProducts,"size");
  const JobNameParameter = getParameterByParameterCode(subProducts,"JobName");
  const SetsParameter = getParameterByParameterCode(subProducts,"Sets");
  const QuantityParameter = getParameterByParameterCode(subProducts,"quantity");

  return {
    WidthParameter,
    HeightParameter,
    SizeParameter,
    JobNameParameter,
    SetsParameter,
    QuantityParameter
  };
};

export { useConstParameters };
