import { IconButton, MenuItem } from "@mui/material";
import { MoreCircleIcon } from "@/icons";
import { GoMakeMenu } from "@/components";
import { useMoreCircle } from "./use-more-circle";
import { useStyle } from "./style";
import { AddNegotiateRequestModal } from "../modals-widgets/add-negotiate-request-modal";
import { DuplicateItemModal } from "../modals-widgets/duplicate-item-modal";

const MoreMenuWidget = () => {
  const { clasess } = useStyle();
  const { open, anchorEl, menuList, handleClose, handleClick } =
    useMoreCircle();
  return (
    <>
      <IconButton onClick={handleClick}>
        <MoreCircleIcon />
      </IconButton>
      <GoMakeMenu handleClose={handleClose} open={open} anchorEl={anchorEl}>
        {menuList?.map((item, index) => {
          return (
            <>
              <MenuItem
                style={clasess.menuItemContainer}
                key={index}
                onClick={item?.onclick}
              >
                {item?.icon}
                <div style={clasess.menuTitleStyle}>{item?.name}</div>
              </MenuItem>
              {index != menuList?.length - 1 ? (
                <div style={clasess.lineStyle} />
              ) : null}
            </>
          );
        })}
      </GoMakeMenu>
      <AddNegotiateRequestModal />
      <DuplicateItemModal />
    </>
  );
};
export { MoreMenuWidget };
