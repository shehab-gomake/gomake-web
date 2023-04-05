import Image from "next/image";

import { IconButton } from "@mui/material";

import moreCircle from "@/icons/more-circle.png";
import { useSheetModal } from "./use-show-supplier-list";

const ShowSupplierListForSheet = ({ item }: any) => {
  const { showUnderRowWidget, setShowUnderRowWidget } = useSheetModal();

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
export { ShowSupplierListForSheet };
