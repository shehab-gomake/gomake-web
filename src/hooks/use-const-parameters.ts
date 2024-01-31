import { subProductsParametersState } from "@/store";
import { useRecoilValue } from "recoil";

const useConstParameters = () => {
  const subProducts = useRecoilValue<any>(subProductsParametersState);
  return {
  };
};

export { useConstParameters };
