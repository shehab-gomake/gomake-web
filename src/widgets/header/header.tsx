import {
  Avatar,
  IconButton,
  MenuItem,
  styled,
  Tooltip,
  tooltipClasses,
  TooltipProps,
} from "@mui/material";
import { EditIcon } from "@/icons";
import { useStyle } from "./style";
import { useHeader } from "./use-header";
import { GoMakeMenu } from "@/components";
import { useRecoilState, useRecoilValue } from "recoil";
import { userProfileState } from "@/store/user-profile";
import { QuoteIfExistState } from "@/pages-components/quote-new/store/quote";
import { CartIcon } from "@/icons/cart-icon";
import { MessengerNotifications } from "@/widgets/messenger-notifications-widget/messenger-notifications";
import { FrontdeskNav } from "@/widgets/frontdesk-nav/frontdesk-nav";
import { SystemNotifications } from "@/widgets/system-notifications-widget/system-notifications";
import { SystemHelp } from "./components/system-help-and-support-widget/system-help-and-support-widget";

export const CustomTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(() => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#2f2f2f",
    color: "#ffffff",
    fontSize: 12,
    fontWeight: 500,
    padding: "6px 10px",
    borderRadius: 6,
  },
  [`& .${tooltipClasses.arrow}`]: {
    color: "#2f2f2f",
  },
}));

const HeaderWidget = () => {
  const { classes } = useStyle();
  const userProfile = useRecoilValue(userProfileState);
  const [QuoteIfExist] = useRecoilState<any>(QuoteIfExistState);
  const { t, user, open, anchorEl, handleClick, handleClose, navigate } =
    useHeader();

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
        <FrontdeskNav />
        <SystemNotifications />
        {QuoteIfExist == true && window.location.pathname != "/quote" && (
          <IconButton
            style={{ backgroundColor: "#f6f6f6", padding: "8px" }}
            onClick={() => navigate("/quote")}
          >
            <CartIcon />
          </IconButton>
        )}
        <SystemHelp />
        <div style={classes.verticalDivider} />
        <div style={classes.profileContainer}>
          <CustomTooltip
            title={`${user?.firstName} ${user?.lastName}`}
            arrow
            placement={"bottom-start"}
          >
            <IconButton style={{ padding: "2px" }} onClick={handleClick}>
              {userAvatar()}
            </IconButton>
          </CustomTooltip>
        </div>
      </div>
      <GoMakeMenu
        handleClose={handleClose}
        open={open}
        anchorEl={anchorEl}
        menuOffsetY={1}
      >
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
