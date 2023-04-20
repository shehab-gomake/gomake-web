import Image from "next/image";

import { IconButton } from "@mui/material";

import moreCircle from "@/icons/more-circle.png";
import { SheetPageMoreModal } from "./more-modal";
import { useLaminationModal } from "./use-lamination-modal";
import { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import { refetchMaterialDataState } from "@/store/refetch-material-data";

const MoreCircle = ({ item }: any) => {
  const {
    laminationThickness,
    openModal,
    OnClickGetLaminationThickness,
    onCloseModal,
    getLaminationThickness,
  } = useLaminationModal({
    item,
  });
  const setRefetchMaterialDataState = useSetRecoilState(
    refetchMaterialDataState
  );
  const onClickGetSheetSizesInside = () => {
    OnClickGetLaminationThickness();
    setRefetchMaterialDataState({
      refetch: () => getLaminationThickness(item),
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
        laminationThickness={laminationThickness}
      />
    </>
  );
};
export { MoreCircle };
