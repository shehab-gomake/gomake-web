import { useRecoilState } from "recoil";

import { ShowSupplierList } from "@/store";

const useShowList = () => {
  const [showUnderRowWidget, setShowUnderRowWidget] =
    useRecoilState(ShowSupplierList);

  return {
    showUnderRowWidget,
    setShowUnderRowWidget,
  };
};

export { useShowList };
