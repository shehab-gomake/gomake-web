import Image from "next/image";

import { IconButton } from "@mui/material";

import moreCircle from "@/icons/more-circle.png";
import { useKernelsModal } from "./use-show-supplier-list";

const ShowSupplierListForKernels = ({ item }: any) => {
  const { showUnderRowWidget, setShowUnderRowWidget } = useKernelsModal();

  return (
    <>
      <IconButton
        onClick={() =>
          setShowUnderRowWidget({
            stateShow: true,
            widget: <div>Hey</div>,
            item,
            key: "code",
          })
        }
      >
        <Image src={moreCircle} width={24} height={24} alt="More" />
      </IconButton>
    </>
  );
};
export { ShowSupplierListForKernels };
