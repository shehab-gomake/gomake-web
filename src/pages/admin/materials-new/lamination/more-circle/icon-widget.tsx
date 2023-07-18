import { IconButton } from "@mui/material";
import { useState } from "react";
import { GoMakeMenu } from "@/components";
import { MenuItem } from "@mui/material";
import { MoreCircleIcon } from "@/icons";

const IconWidget = ({
  t,
  onOpnUpdateModal,
  onOpenDeleteModal,
  onOpnDuplicateModal,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <>
      <IconButton onClick={handleClick}>
        <MoreCircleIcon />

        {/* <DeleteIcon style={{ color: "#a1a2cd" }} /> */}
      </IconButton>
      <GoMakeMenu handleClose={handleClose} open={open} anchorEl={anchorEl}>
        <MenuItem
          onClick={() => {
            handleClose();
            onOpnUpdateModal();
          }}
        >
          Edit
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleClose();
            onOpnDuplicateModal();
          }}
        >
          Duplicate
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleClose();
            onOpenDeleteModal();
          }}
        >
          Delete
        </MenuItem>
      </GoMakeMenu>
      {/* <Tooltip title={t("materials.buttons.edit")}>
        <IconButton onClick={onOpnUpdateModal}>
          <Image src={moreCircle} width={24} height={24} alt="More" />
        </IconButton>
      </Tooltip>
      <Tooltip title={t("materials.buttons.delete")}>
        <IconButton onClick={onOpenDeleteModal}>
          <DeleteIcon style={{ color: "#a1a2cd" }} />
        </IconButton>
      </Tooltip> */}
    </>
  );
};
export { IconWidget };
