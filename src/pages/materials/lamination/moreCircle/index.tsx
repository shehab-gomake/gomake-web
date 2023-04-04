import { useState } from "react";
import Image from "next/image";
import moreCircle from "@/icons/more-circle.png";
import { IconButton } from "@mui/material";
import { GoMakeModal } from "@/components";
import { useStyle } from "./style";
import { MoreModal } from "./more-modal";

const MoreCircle = ({ item }: any) => {
  const [openModal, setOpenModal] = useState(false);
  return (
    <>
      <IconButton onClick={() => setOpenModal(true)}>
        <Image src={moreCircle} width={24} height={24} alt="More" />
      </IconButton>
      <MoreModal openModal={openModal} setOpenModal={setOpenModal} />
    </>
  );
};
export { MoreCircle };
