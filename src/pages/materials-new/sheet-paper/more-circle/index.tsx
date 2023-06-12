import Image from "next/image";

import { IconButton } from "@mui/material";

import moreCircle from "@/icons/more-circle.png";
import { SheetPageMoreModal } from "./more-modal";
import { useSheetModal } from "./use-sheet-modal";
import { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import { refetchMaterialDataState } from "@/store/refetch-material-data";

const SheetPageMoreCircle = ({ item }: any) => {
  const {
    openModal,
    OnClickGetSheetSizes,
    getSheetSizes,
    sheetSizes,
    onCloseModal,
  } = useSheetModal({
    item,
  });
  const setRefetchMaterialDataState = useSetRecoilState(
    refetchMaterialDataState
  );
  const onClickGetSheetSizesInside = () => {
    OnClickGetSheetSizes();
    setRefetchMaterialDataState({
      refetch: () => getSheetSizes(item),
    });
  };
  return (
    <>
      <IconButton onClick={onClickGetSheetSizesInside}>
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
export { SheetPageMoreCircle };
