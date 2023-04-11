import Image from "next/image";

import { IconButton } from "@mui/material";

import moreCircle from "@/icons/more-circle.png";
import { SheetPageMoreModal } from "./more-modal";
import { useApplicationModal } from "./use-encapsulation-roll-modal";
import { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import { refetchMaterialDataState } from "@/store/refetch-material-data";

const EncapsulationRollMoreCircle = ({ item }: any) => {
  const {
    openModal,
    encapsulationRollSizes,
    OnClickGetEncapsulationSizes,
    getEncapsulationSizes,
    onCloseModal,
  } = useApplicationModal({
    item,
  });
  const setRefetchMaterialDataState = useSetRecoilState(
    refetchMaterialDataState
  );
  const onClickGetSheetSizesInside = () => {
    OnClickGetEncapsulationSizes();
    setRefetchMaterialDataState({
      refetch: () => getEncapsulationSizes(item),
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
        encapsulationRollSizes={encapsulationRollSizes}
      />
    </>
  );
};
export { EncapsulationRollMoreCircle };
