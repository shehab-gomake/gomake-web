import { IconButton, MenuItem } from "@mui/material";
import { MoreCircleIcon } from "@/icons";
import { GoMakeMenu } from "@/components";
import { useMoreCircle } from "./use-more-circle";
import { useStyle } from "./style";
import { ConvertIcon } from "./icons/convert";
import { EditingIcon } from "./icons/editing";
import { FONT_FAMILY } from "@/utils/font-family";

const MoreMenuWidget = ({ item, updatedProduct }: any) => {
  const { clasess } = useStyle();
  const {
    open,
    anchorEl,
    handleClose,
    handleClick,
    navigate,
    updatedProductInside,
  } = useMoreCircle({
    updatedProduct,
  });

  return (
    <>
      <IconButton onClick={handleClick}>
        <MoreCircleIcon />
      </IconButton>
      <GoMakeMenu handleClose={handleClose} open={open} anchorEl={anchorEl}>
        <MenuItem
          onClick={() => navigate(`/settings/products/edit/${item?.id}`)}
        >
          <div style={clasess.menuRowStyle}>
            <EditingIcon />
            <div style={clasess.rowTextStyle}>Editing</div>
          </div>
        </MenuItem>
        <MenuItem onClick={() => updatedProductInside(item)}>
          <div style={clasess.menuRowStyle}>
            <ConvertIcon />
            <div style={clasess.rowTextStyle}>
              {item?.status ? " Convert to inactive" : " Convert to active"}
            </div>
          </div>
        </MenuItem>
      </GoMakeMenu>
    </>
  );
};
export { MoreMenuWidget };
