import Image from "next/image";

import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton, Tooltip } from "@mui/material";
import moreCircle from "@/icons/more-circle.png";

const IconWidget = ({ t, onOpnUpdateModal, onOpenDeleteModal }) => {
  return (
    <>
      <Tooltip title={t("materials.sheetPaper.admin.edit")}>
        <IconButton onClick={onOpnUpdateModal}>
          <Image src={moreCircle} width={24} height={24} alt="More" />
        </IconButton>
      </Tooltip>
      <Tooltip title={t("materials.sheetPaper.admin.delete")}>
        <IconButton onClick={onOpenDeleteModal}>
          <DeleteIcon style={{ color: "#a1a2cd" }} />
        </IconButton>
      </Tooltip>
    </>
  );
};
export { IconWidget };
