import { useRecoilState } from "recoil";
import { ShowSupplierList } from "@/store";

const useShowSupplierList = () => {
  const [showUnderRowWidget, setShowUnderRowWidget] =
    useRecoilState(ShowSupplierList);

  return {
    showUnderRowWidget,
    setShowUnderRowWidget,
  };
};

export { useShowSupplierList };
