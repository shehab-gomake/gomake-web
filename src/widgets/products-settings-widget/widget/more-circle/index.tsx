import { IconButton, MenuItem } from "@mui/material";
import { MoreCircleIcon } from "@/icons";
import { useMoreCircle } from "./use-more-circle";
import { useStyle } from "./style";

const MoreMenuWidget = () => {
  const { clasess } = useStyle();
  const { open, anchorEl, handleClose, handleClick } = useMoreCircle();
  return (
    <>
      <IconButton>
        <MoreCircleIcon />
      </IconButton>
    </>
  );
};
export { MoreMenuWidget };
