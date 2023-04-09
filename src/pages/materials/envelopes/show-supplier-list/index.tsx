import Image from "next/image";

import { IconButton } from "@mui/material";

import moreCircle from "@/icons/more-circle.png";
import { useEnvelopesModal } from "./use-show-supplier-list";

const ShowSupplierListForEnvelopes = ({ item }: any) => {
  const { showUnderRowWidget, setShowUnderRowWidget } = useEnvelopesModal();

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
export { ShowSupplierListForEnvelopes };
