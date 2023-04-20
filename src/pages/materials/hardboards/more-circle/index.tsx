import { useCallback, useState } from "react";
import Image from "next/image";

import { IconButton } from "@mui/material";
import { getAndSetHardboardsThicknes } from "@/services/hooks";
import moreCircle from "@/icons/more-circle.png";
import { useGomakeAxios } from "@/hooks";

import { MoreModal } from "./more-modal";
import { useHardboardsModal } from "./use-hardboards-modal";
import { useSetRecoilState } from "recoil";
import { refetchMaterialDataState } from "@/store/refetch-material-data";

const MoreCircle = ({ item }: any) => {
  const {
    openModal,
    onClickHardboardsThickness,
    getHardboardsThickness,
    hardboardThickness,
    onCloseModal,
  } = useHardboardsModal({
    item,
  });
  const setRefetchMaterialDataState = useSetRecoilState(
    refetchMaterialDataState
  );
  const onClickGetSheetSizesInside = () => {
    onClickHardboardsThickness();
    setRefetchMaterialDataState({
      refetch: () => getHardboardsThickness(item),
    });
  };

  return (
    <>
      <IconButton onClick={onClickGetSheetSizesInside}>
        <Image src={moreCircle} width={24} height={24} alt="More" />
      </IconButton>
      <MoreModal
        openModal={openModal}
        onCloseModal={onCloseModal}
        hardboardThickness={hardboardThickness}
      />
    </>
  );
};
export { MoreCircle };
