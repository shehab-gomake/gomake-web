import { useRecoilState } from "recoil";

import { ShowSupplierList } from "@/store";

const useShowThicknesList = () => {
  const [showUnderRowWidget, setShowUnderRowWidget] =
    useRecoilState(ShowSupplierList);

  return {
    showUnderRowWidget,
    setShowUnderRowWidget,
  };
};

export { useShowThicknesList };
