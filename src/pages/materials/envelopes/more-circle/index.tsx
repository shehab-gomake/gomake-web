import Image from "next/image";

import { IconButton } from "@mui/material";

import moreCircle from "@/icons/more-circle.png";
import { SheetPageMoreModal } from "./more-modal";
import { useSheetModal } from "./use-sheet-modal";

const SheetPageMoreCircle = ({ item }: any) => {
  const { openModal, OnClickGetSheetSizes, setOpenModal, sheetSizes } =
    useSheetModal({
      item,
    });

  return (
    <>
      <IconButton onClick={OnClickGetSheetSizes}>
        <Image src={moreCircle} width={24} height={24} alt="More" />
      </IconButton>
      <SheetPageMoreModal
        openModal={openModal}
        setOpenModal={setOpenModal}
        sheetSizes={sheetSizes}
      />
    </>
  );
};
export { SheetPageMoreCircle };
