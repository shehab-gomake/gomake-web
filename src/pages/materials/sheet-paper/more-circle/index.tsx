import { useState } from "react";
import Image from "next/image";
import moreCircle from "@/icons/more-circle.png";
import { IconButton } from "@mui/material";
import { SheetPageMoreModal } from "./more-modal";

const SheetPageMoreCircle = ({ item }: any) => {
  const [openModal, setOpenModal] = useState(false);
  return (
    <>
      <IconButton onClick={() => setOpenModal(true)}>
        <Image src={moreCircle} width={24} height={24} alt="More" />
      </IconButton>
      <SheetPageMoreModal openModal={openModal} setOpenModal={setOpenModal} />
    </>
  );
};
export { SheetPageMoreCircle };
