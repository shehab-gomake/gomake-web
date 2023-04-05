import Image from "next/image";

import { IconButton } from "@mui/material";

import moreCircle from "@/icons/more-circle.png";
import { useSheetModal } from "./use-sheet-modal";
import { ShowSupplierListForSheetModal } from "./show-supplier-list";

const ShowSupplierListForSheet = ({ item }: any) => {
  const { openModal, OnClickGetSheetSizes, setOpenModal, sheetSizes } =
    useSheetModal({
      item,
    });

  return (
    <>
      <IconButton onClick={() => setOpenModal(true)}>
        <Image src={moreCircle} width={24} height={24} alt="More" />
      </IconButton>
      <div>Hay</div>
    </>
  );
};
export { ShowSupplierListForSheet };
