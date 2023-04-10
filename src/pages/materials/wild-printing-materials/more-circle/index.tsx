import Image from "next/image";

import { IconButton } from "@mui/material";

import moreCircle from "@/icons/more-circle.png";
import { SheetPageMoreModal } from "./more-modal";
import { useWildPrintingMatieralsModal } from "./use-wild-printing-material-modal";

const WildPrintingMaterialsPageMoreCircle = ({ item }: any) => {
  const { openModal, OnClickGetSheetSizes, sheetSizes, onCloseModal } =
    useWildPrintingMatieralsModal({
      item,
    });

  return (
    <>
      <IconButton onClick={OnClickGetSheetSizes}>
        <Image src={moreCircle} width={24} height={24} alt="More" />
      </IconButton>
      <SheetPageMoreModal
        openModal={openModal}
        onCloseModal={onCloseModal}
        sheetSizes={sheetSizes}
      />
    </>
  );
};
export { WildPrintingMaterialsPageMoreCircle };
