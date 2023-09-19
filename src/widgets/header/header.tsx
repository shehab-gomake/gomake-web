import { useTranslation } from "react-i18next";
import { IconButton, MenuItem } from "@mui/material";

import { EditIcon, ProfileImg } from "@/icons";

import { useStyle } from "./style";
import { useHeader } from "./use-header";
import { GoMakeMenu } from "@/components";

const HeaderWidget = () => {
  const { clasess } = useStyle();
  const { t } = useTranslation();
  const { user, open, anchorEl, handleClick, handleClose, navigate } =
    useHeader();
  return (
    <div style={clasess.container}>
      <div style={{ width: "100%" }} />
      {/* <GoMakeTextInputIcon
        style={clasess.searchInputContainer}
        placeholder={t("header.search")}
        startAdornment={
          <InputAdornment position="start">
            <div style={clasess.iconStyle}>
              <SearchIcon width={20} height={20} />
            </div>
          </InputAdornment>
        }
      /> */}
      <div style={clasess.rightSideContainer}>
        {/* <IconButton>
          <Statistics />
        </IconButton>
        <IconButton>
          <Messages />
        </IconButton>
        <IconButton>
          <Notifications />
        </IconButton> */}
        <div style={clasess.profileContainer}>
          <IconButton onClick={handleClick}>
            <ProfileImg />
          </IconButton>
          {/* <div style={clasess.userNameStyle}>{user?.displayName}</div> */}
        </div>
      </div>
      <GoMakeMenu handleClose={handleClose} open={open} anchorEl={anchorEl}>
        <div style={clasess.mainMenuContainer}>
          <div style={clasess.accountTextStyle}>ACCOUNT</div>
          <div style={clasess.imgNameContainer}>
            <ProfileImg />
            <div>
              <div
                style={clasess.nameTextStyle}
              >{`${user?.firstName} ${user?.lastName}`}</div>
              <div style={clasess.emailTextStyle}>{user?.email}</div>
            </div>
          </div>
          <MenuItem
            style={{ width: "100%", minWidth: 200 }}
            onClick={() => navigate("/settings/profile")}
          >
            <div style={clasess.manageAccountStyle}>
              <div style={clasess.manageAccountTextStyle}>Manage Account</div>
              <EditIcon />
            </div>
          </MenuItem>
          <div style={clasess.lineContainer} />
          <MenuItem style={clasess.logoutContainer}>
            <div style={clasess.logoutContainer}>Log out</div>
          </MenuItem>
        </div>
      </GoMakeMenu>
    </div>
  );
};
export { HeaderWidget };
