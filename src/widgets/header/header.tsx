import { useTranslation } from "react-i18next";
import { Avatar, IconButton, MenuItem } from "@mui/material";

import { EditIcon } from "@/icons";

import { useStyle } from "./style";
import { useHeader } from "./use-header";
import { GoMakeMenu } from "@/components";
import { useRecoilValue } from "recoil";
import { userProfileState } from "@/store/user-profile";

const HeaderWidget = () => {
    const {clasess} = useStyle();
    const { t } = useTranslation();
    const userProfile = useRecoilValue(userProfileState);
    const {user, open, anchorEl, handleClick, handleClose, navigate} =
        useHeader();
    const userAvatar = () => {
        return !!userProfile.imagePath ? <Avatar style={clasess.avatarProps} src={`${userProfile.imagePath}?${new Date()}`}/> :
            <Avatar  style={{backgroundColor: userProfile.avatarBackGroundColor, ...clasess.avatarProps}}>{userProfile.avatarInitials?.toUpperCase()}</Avatar>
    }
    return (
        <div style={clasess.container}>
            <div style={{width: "100%"}}/>
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
          <IconButton onClick={handleClick}>{userAvatar()}</IconButton>
          {/* <div style={clasess.userNameStyle}>{user?.displayName}</div> */}
        </div>
      </div>
      <GoMakeMenu handleClose={handleClose} open={open} anchorEl={anchorEl}>
        <div style={clasess.mainMenuContainer}>
          <div style={clasess.accountTextStyle}>ACCOUNT</div>
          <div style={clasess.imgNameContainer}>
            {userAvatar()}
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
          <MenuItem
            style={clasess.logoutContainer}
            onClick={() => {
              localStorage.removeItem("auth-token");
              navigate("/login");
            }}
          >
            <div style={clasess.logoutContainer}>Log out</div>
          </MenuItem>
        </div>
      </GoMakeMenu>
    </div>
  );
};
export { HeaderWidget };
