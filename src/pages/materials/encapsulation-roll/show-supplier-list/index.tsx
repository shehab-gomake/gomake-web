import Image from "next/image";

import { IconButton } from "@mui/material";

import moreCircle from "@/icons/more-circle.png";
import { useShowSupplierList } from "./use-show-supplier-list";
import { ShowSupplierListInsideEncapsulationRoll } from "./show-supplier-list-widget";

const ShowSupplierListForEncapsulationRoll = ({ item }: any) => {
  const { setShowUnderRowWidget } = useShowSupplierList();

  return (
    <>
      <IconButton
        onClick={() =>
          setShowUnderRowWidget({
            stateShow: true,
            widget: <ShowSupplierListInsideEncapsulationRoll item={item} />,
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
export { ShowSupplierListForEncapsulationRoll };
