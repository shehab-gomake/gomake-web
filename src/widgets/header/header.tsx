import { useTranslation } from "react-i18next";
import {
  Avatar,
  IconButton,
  MenuItem,
  Stack,
} from "@mui/material";
import {
  EditIcon,
  Notifications,
} from "@/icons";
import { useStyle } from "./style";
import { useHeader } from "./use-header";
import { ColoredCycle, GoMakeMenu } from "@/components";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { userProfileState } from "@/store/user-profile";
import { QuoteIfExistState } from "@/pages-components/quote-new/store/quote";
import { CartIcon } from "@/icons/cart-icon";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { SecondaryButton } from "@/components/button/secondary-button";
import { MarkIcon } from "@/icons/mark-icon";
import { showTourModalState } from "@/store/tour-state";
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import { HelpIcon } from "@/icons/help-icon";
const HeaderWidget = () => {
  const { classes } = useStyle();
  const { t } = useTranslation();
  const dir: "rtl" | "ltr" = t("direction");
  const userProfile = useRecoilValue(userProfileState);
  const [QuoteIfExist] =
    useRecoilState<any>(QuoteIfExistState);
  const { primaryColor, successColor, warningColor } = useGomakeTheme();
  const {
    user,
    open,
    anchorEl,
    handleClick,
    handleClose,
    navigate,
    openNotify,
    anchorNotifyEl,
    handleCloseNotify,
    handleClickSupport,
    openSupport,
    anchorSupportEl,
    handleCloseSupport
  } = useHeader();
  const setShowTourModal = useSetRecoilState(showTourModalState);
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
      {/* <SearchInputComponent onChange={() => null} searchInputStyle={classes.searchInputContainer} /> */}
      <div style={{ width: "100%" }} />
      <div style={classes.rightSideContainer}>
        <IconButton style={{padding:"5px"}} data-tour={'start-tour-btn'} onClick={handleClickSupport}>
          <HelpIcon width={26} height={26} />
        </IconButton >
        {QuoteIfExist == true && window.location.pathname != "/quote" && (
          <IconButton style={classes.iconBtnContainer} onClick={() => navigate("/quote")}>
            <CartIcon width={26} height={26} />
          </IconButton>
        )}
        {/* <IconButton>
          <Messages />
        </IconButton> */}
        {/* <IconButton onClick={handleClickNotify}>
          <Notifications />
        </IconButton> */}
        <div style={classes.profileContainer}>
          <IconButton style={{padding:"5px"}} onClick={handleClick}>{userAvatar()}</IconButton>
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
      <GoMakeMenu
        handleClose={handleCloseNotify}
        open={openNotify}
        anchorEl={anchorNotifyEl}
      >
        <div style={classes.mainMenuContainer2}>
          <div style={classes.notificationTextStyle}>{t("Notifications")}</div>
          <MenuItem style={classes.menuItemContainer}>
            <ColoredCycle
              backgroundColor={successColor(400)}
              size={"8px"}
            ></ColoredCycle>
            <Stack direction="column" gap={"8px"}>
              <div style={classes.menuItemTextStyle}>
                <h3 style={classes.textStyle}>
                  Follow up for jobs that you started it
                </h3>
              </div>
              <Stack direction="row" gap={"8px"} padding={"0px 0px 0px 64px"}>
                <SecondaryButton
                  variant="contained"
                  style={classes.acceptBtnStyle}
                >
                  Accept
                </SecondaryButton>
                <SecondaryButton
                  variant="outlined"
                  style={classes.rejectBtnStyle}
                >
                  Reject
                </SecondaryButton>
              </Stack>
              <h3 style={classes.subTextStyle}>Today at 9:42 AM</h3>
            </Stack>
          </MenuItem>
          <div style={classes.lineContainer} />
          <MenuItem style={classes.menuItemContainer}>
            <ColoredCycle
              backgroundColor={successColor(400)}
              size={"8px"}
            ></ColoredCycle>
            <Stack direction="column" gap={"8px"} width={"95%"}>
              <div style={classes.menuItemTextStyle}>
                <h3 style={classes.textStyle}>
                  Your quote just has been{" "}
                  <span style={{ color: successColor(500) }}>approved</span>,
                  you can move to next step
                </h3>
              </div>
              <h3 style={classes.subTextStyle}>Yesterday at 11:42 PM</h3>
            </Stack>
          </MenuItem>
          <div style={classes.lineContainer} />
          <MenuItem style={classes.menuItemContainer}>
            <ColoredCycle
              backgroundColor={warningColor(400)}
              size={"8px"}
            ></ColoredCycle>
            <Stack direction="column" gap={"8px"} width={"95%"}>
              <div style={classes.menuItemTextStyle}>
                <h3 style={classes.textStyle}>
                  your newest quotes is waiting for payment, check your quote
                  process
                </h3>
              </div>
              <h3 style={classes.subTextStyle}>Yesterday at 11:42 PM</h3>
            </Stack>
          </MenuItem>
          <div style={classes.lineContainer} />
          <MenuItem style={classes.menuItemContainer}>
            <ColoredCycle
              backgroundColor={primaryColor(400)}
              size={"8px"}
            ></ColoredCycle>
            <Stack direction="column" gap={"8px"} width={"95%"}>
              <div style={classes.menuItemTextStyle}>
                <h3 style={classes.textStyle}>
                  a quote that you created it need for manager approval, stay
                  tuned for new events
                </h3>
              </div>
              <h3 style={classes.subTextStyle}>Yesterday at 11:42 PM</h3>
            </Stack>
          </MenuItem>
          <div style={classes.lineContainer} />
          <MenuItem style={classes.footerItemContainer}>
            <div style={classes.footerTextStyle}>{t("Mark all as read")}</div>
            <MarkIcon />
          </MenuItem>
        </div>
      </GoMakeMenu>
      <GoMakeMenu handleClose={handleCloseSupport} open={openSupport} anchorEl={anchorSupportEl}>
        <div style={classes.mainMenuContainer}>
          <MenuItem
            style={classes.logoutContainer}
            onClick={() => navigate("/customer-service")}
          >
            <div style={classes.logoutContainer}>{t("header.customerSupport")}</div>
          </MenuItem>
          <div style={classes.lineContainer} />
          <MenuItem
            style={classes.logoutContainer}
            onClick={() => {
              setShowTourModal(true);
            }}
          >
            <div style={classes.logoutContainer}>{t("header.guideAndTutorial")}</div>
          </MenuItem>
        </div>
      </GoMakeMenu>
    </div>
  );
};
export { HeaderWidget };
