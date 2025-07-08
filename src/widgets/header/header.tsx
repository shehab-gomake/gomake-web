import { Avatar, Badge, IconButton, MenuItem, Stack } from "@mui/material";
import { EditIcon, Notifications } from "@/icons";
import { useStyle } from "./style";
import { useHeader } from "./use-header";
import { ColoredCycle, GoMakeMenu } from "@/components";
import { useRecoilState, useRecoilValue } from "recoil";
import { userProfileState } from "@/store/user-profile";
import { QuoteIfExistState } from "@/pages-components/quote-new/store/quote";
import { CartIcon } from "@/icons/cart-icon";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { SecondaryButton } from "@/components/button/secondary-button";
import { MarkIcon } from "@/icons/mark-icon";
import { HelpIcon } from "@/icons/help-icon";
import { MessengerNotifications } from "@/widgets/messenger-notifications-widget/messenger-notifications";
import { SystemNotifications } from "@/widgets/system-notifications-widget/system-notifications";
import { FONT_FAMILY } from "@/utils/font-family";
import { SystemHelp } from "./components/system-help-and-support-widget/system-help-and-support-widget";

const HeaderWidget = () => {
  const { classes } = useStyle();
  const userProfile = useRecoilValue(userProfileState);
  const [QuoteIfExist] = useRecoilState<any>(QuoteIfExistState);
  const { primaryColor, successColor, warningColor } = useGomakeTheme();
  const {
    t,
    user,
    open,
    anchorEl,
    handleClick,
    handleClose,
    navigate,
    openNotify,
    anchorNotifyEl,
    handleCloseNotify,
    handleClickNotify,
  } = useHeader();

  const userAvatar = () => {
    return !!userProfile.imagePath ? (
      <Avatar style={classes.avatarProps} src={userProfile.imagePath} />
    ) : (
      <Avatar
        style={{
          backgroundColor: userProfile.avatarBackGroundColor,
          ...classes.avatarProps,
        }}
      >
        {userProfile.avatarInitials?.toUpperCase()}
      </Avatar>
    );
  };

  return (
    <div style={classes.container}>
      <div style={{ width: "100%" }} />
      <div style={classes.rightSideContainer}>
        <MessengerNotifications />
        <SystemNotifications />
        <SystemHelp />
        {QuoteIfExist == true && window.location.pathname != "/quote" && (
          <IconButton
            style={classes.iconBtnContainer}
            onClick={() => navigate("/quote")}
          >
            <CartIcon width={32} height={32} />
          </IconButton>
        )}
        <div style={classes.profileContainer}>
          <IconButton style={{ padding: "2px" }} onClick={handleClick}>
            {userAvatar()}
          </IconButton>
          {/* <div style={classes.userNameStyle}>{user?.displayName}</div> */}
        </div>
      </div>
      <GoMakeMenu handleClose={handleClose} open={open} anchorEl={anchorEl}>
        <div style={classes.mainMenuContainer}>
          <div style={classes.accountTextStyle}>{t("login.account")}</div>
          <div style={classes.imgNameContainer}>
            {userAvatar()}
            <div>
              <div
                style={classes.nameTextStyle}
              >{`${user?.firstName} ${user?.lastName}`}</div>
              <div style={classes.emailTextStyle}>{user?.email}</div>
            </div>
          </div>
          <MenuItem
            style={{ width: "100%", minWidth: 200 }}
            onClick={() => navigate("/settings/profile")}
            onMouseDown={(e) => {
              if (e.button === 1) {
                window.open("/settings/profile", "_blank");
              }
            }}
          >
            <div style={classes.manageAccountStyle}>
              <div style={classes.manageAccountTextStyle}>
                {t("login.manageAccount")}
              </div>
              <EditIcon />
            </div>
          </MenuItem>
          <div style={classes.lineContainer} />
          <MenuItem
            style={classes.logoutContainer}
            onClick={() => {
              localStorage.removeItem("auth-token");
              navigate("/login");
            }}
          >
            <div style={classes.logoutContainer}>{t("login.logOut")}</div>
          </MenuItem>
        </div>
      </GoMakeMenu>
    </div>
  );
};
export { HeaderWidget };
