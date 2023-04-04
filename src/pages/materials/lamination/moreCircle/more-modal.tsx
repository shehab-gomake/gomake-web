import { useState } from "react";
import Image from "next/image";
import moreCircle from "@/icons/more-circle.png";
import { IconButton } from "@mui/material";
import { GoMakeModal } from "@/components";
import { useStyle } from "./style";

const MoreModal = ({ openModal, setOpenModal }: any) => {
  return (
    <GoMakeModal
      openModal={openModal}
      modalTitle="Test"
      onClose={() => setOpenModal(false)}
      insideStyle={{ width: "100%" }}
    >
      <div>"ggggg</div>
    </GoMakeModal>
  );
};
export { MoreModal };
