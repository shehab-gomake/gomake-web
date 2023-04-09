import { useGomakeAxios } from "@/hooks";
import { useRecoilState } from "recoil";
import { ShowSupplierList } from "@/store";

const useKernelsModal = () => {
  const { callApi } = useGomakeAxios();
  const [showUnderRowWidget, setShowUnderRowWidget] =
    useRecoilState(ShowSupplierList);

  return {
    showUnderRowWidget,
    setShowUnderRowWidget,
  };
};

export { useKernelsModal };
