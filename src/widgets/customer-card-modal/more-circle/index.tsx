import { IconButton, MenuItem } from "@mui/material";
import { MoreCircleIcon } from "@/icons";
import { GoMakeMenu } from "@/components";
import { useMoreCircle } from "./use-more-circle";
import { useStyle } from "./style";
import { ConvertIcon } from "./icons/convert";
import { EditingIcon } from "./icons/editing";

const MoreMenuWidget = ({ item, updatedStatus, onClickEdit }: any) => {
  const { clasess } = useStyle();
  const {
    open,
    anchorEl,
    handleClose,
    handleClick,
    updatedCustomerStatus,
  } = useMoreCircle({
    updatedStatus,
  });

  const handleEditClick = async () => {
    onClickEdit(item.id)
  };

  return (
    <>
      <IconButton onClick={handleClick}>
        <MoreCircleIcon />
      </IconButton>
      <GoMakeMenu handleClose={handleClose} open={open} anchorEl={anchorEl}>
        <MenuItem onClick={handleEditClick} >
          <div style={clasess.menuRowStyle}>
            <EditingIcon />
            <div style={clasess.rowTextStyle}>Editing</div>
          </div>
        </MenuItem>
        <MenuItem onClick={() => updatedCustomerStatus(item)}>
          <div style={clasess.menuRowStyle}>
            <ConvertIcon />
            <div style={clasess.rowTextStyle}>
              {item?.isActive ? " Convert to inactive" : " Convert to active"}
            </div>
          </div>
        </MenuItem>
      </GoMakeMenu>
    </>
  );
};
export { MoreMenuWidget };
