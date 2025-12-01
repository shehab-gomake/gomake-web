import {
  Avatar,
  IconButton,
  MenuItem,
  styled,
  Tooltip,
  tooltipClasses,
  TooltipProps,
  Badge,
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
import { FrontDeskNav } from "@/widgets/frontdesk-nav/frontdesk-nav";
import { SystemNotifications } from "@/widgets/system-notifications-widget/system-notifications";
import { SystemHelp } from "./components/system-help-and-support-widget/system-help-and-support-widget";
import { TrialIndicator } from "@/components";
import {
  useTicketChatbot,
  useTicketNotifications,
} from "@/components/ticket-chatbot";
import HeadsetMicOutlinedIcon from "@mui/icons-material/HeadsetMicOutlined";
import { useThemeComponent } from "@/contexts/theme/useThemeComponent";
import { useTheme } from "@/contexts/theme";

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

const HeaderWidget = ({
  customStyle,
}: {
  customStyle?: React.CSSProperties;
}) => {
  const { classes, primaryColor, secondColor } = useStyle();
  const userProfile = useRecoilValue(userProfileState);
  const [QuoteIfExist] = useRecoilState<any>(QuoteIfExistState);
  const { t, user, open, anchorEl, handleClick, handleClose, navigate } =
    useHeader();
  const { openChatbot } = useTicketChatbot();
  const { unreadCount } = useTicketNotifications();

  // Use theme-aware TrialIndicator (will use HpTrialIndicator when hp-client theme is active)
  const { currentTheme, getIconOverride } = useTheme();
  const isHpClient = currentTheme === "hp-client";
  const iconButtonBackground = isHpClient ? "transparent" : "#f6f6f6";
  const ThemedTrialIndicator = useThemeComponent(
    "TrialIndicator",
    TrialIndicator
  );

  // Get theme-aware User icon (HP Client icon when theme is active)
  const UserIcon = getIconOverride("UserIcon");

  const userAvatar = () => {
    // Use HpUserIcon when HP theme is active
    if (UserIcon) {
      return <UserIcon width={32} height={32} />;
    }

    // Default Avatar behavior for other themes
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
    <div style={{ ...classes.container, ...customStyle }}>
      <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
        <ThemedTrialIndicator />
        <div style={{ flex: 1 }} />
      </div>
      <div style={classes.rightSideContainer}>
        <FrontDeskNav />
        <SystemNotifications />
        {QuoteIfExist == true && window.location.pathname != "/quote" && (
          <IconButton
            style={{ backgroundColor: iconButtonBackground, padding: "8px" }}
            onClick={() => navigate("/quote")}
          >
            <CartIcon color={secondColor(500)} />
          </IconButton>
        )}
        {/* <CustomTooltip title={t("Support Chat")} arrow placement="bottom">
          <GoSupportChatWidget />
        </CustomTooltip>*/}
        <CustomTooltip
          title={t("tickets.support") || "Support Desk"}
          arrow
          placement="bottom"
        >
          <IconButton
            style={{ backgroundColor: iconButtonBackground, padding: "8px" }}
            onClick={openChatbot}
          >
            <Badge
              badgeContent={unreadCount}
              color="error"
              sx={{
                "& .MuiBadge-badge": {
                  fontSize: "0.7rem",
                  height: 18,
                  minWidth: 18,
                  right: 4,
                  top: 4,
                },
              }}
            >
              <HeadsetMicOutlinedIcon
                style={{ width: 22, height: 22, color: primaryColor(500) }}
              />
            </Badge>
          </IconButton>
        </CustomTooltip>
        <SystemHelp />
        {!isHpClient && <div style={classes.verticalDivider} />}
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
              localStorage.removeItem("refresh-token");
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
