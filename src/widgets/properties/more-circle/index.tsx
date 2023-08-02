import { IconButton, MenuItem } from "@mui/material";
import { MoreCircleIcon } from "@/icons";
import { GoMakeMenu } from "@/components";
import { useMoreCircle } from "./use-more-circle";
import { useStyle } from "./style";
import { AddNewItemModal } from "../properties-modals/add-new-rule-modal";

const MoreMenuWidget = () => {
  const { clasess } = useStyle();
  let openRules = false

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
                onClick={()=> {openRules = true}}
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
      <AddNewItemModal openModal={openRules} />
    </>
  );
};
export { MoreMenuWidget };
