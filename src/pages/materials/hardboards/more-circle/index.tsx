import { useCallback, useState } from "react";
import Image from "next/image";

import { IconButton } from "@mui/material";
import { getAndSetHardboardsThicknes } from "@/services/hooks";
import moreCircle from "@/icons/more-circle.png";
import { useGomakeAxios } from "@/hooks";

import { MoreModal } from "./more-modal";

const MoreCircle = ({ item, categoryName }: any) => {
  const [openModal, setOpenModal] = useState(false);
  const { callApi } = useGomakeAxios();
  const [hardboardsThicknes, setHardboardsThicknes] = useState({});
  const onClickBtn = useCallback(async () => {
    const data = await getAndSetHardboardsThicknes(
      callApi,
      setHardboardsThicknes,
      {
        categoryName: item.categoryName,
        sizeId: item.sizeId,
        supplierId: "",
      }
    );
    if (data) {
      setOpenModal(true);
    }
  }, [categoryName]);
  return (
    <>
      <IconButton onClick={onClickBtn}>
        <Image src={moreCircle} width={24} height={24} alt="More" />
      </IconButton>
      <MoreModal
        openModal={openModal}
        setOpenModal={setOpenModal}
        hardboardsThicknes={hardboardsThicknes}
      />
    </>
  );
};
export { MoreCircle };
