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
import { ColoredCycle, GoMakeMenu, GoMakeTextInputIcon } from "@/components";
import {useRecoilState, useRecoilValue, useSetRecoilState} from "recoil";
import { userProfileState } from "@/store/user-profile";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { QuoteIfExistState } from "@/pages-components/quote-new/store/quote";
import { CartIcon } from "@/icons/cart-icon";
import { SearchInputComponent } from "@/components/form-inputs/search-input-component";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { PrimaryButton } from "@/components/button/primary-button";
import { SecondaryButton } from "@/components/button/secondary-button";
import { MarkIcon } from "@/icons/mark-icon";
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import {startGuideTourState} from "@/store/tour-state";
import {useTour} from "@reactour/tour";
import {useGoMakeTour} from "@/hooks/use-go-make-tour";
const HeaderWidget = () => {
  const { clasess } = useStyle();
  const { t } = useTranslation();
  const dir: "rtl" | "ltr" = t("direction");
  const userProfile = useRecoilValue(userProfileState);
  const [QuoteIfExist, setQuoteIfExist] =
    useRecoilState<any>(QuoteIfExistState);
  const { primaryColor, successColor, warningColor } = useGomakeTheme();
  const {
    user,
    open,
    anchorEl,
    handleClick,
    handleClose,
    navigate,
    handleClickQuoteExist,
    openNotify,
    anchorNotifyEl,
    handleClickNotify,
    handleCloseNotify,
  } = useHeader();
  const {setIsOpen, setCurrentStep} = useTour();
  const {onClickHelpButton} = useGoMakeTour([], []);
  const userAvatar = () => {
    return !!userProfile.imagePath ? (
      <Avatar style={clasess.avatarProps} src={userProfile.imagePath} />
    ) : (
      <Avatar
        style={{
          backgroundColor: userProfile.avatarBackGroundColor,
          ...clasess.avatarProps,
        }}
      >
        {userProfile.avatarInitials?.toUpperCase()}
      </Avatar>
    );
  };

  return (
    <div style={clasess.container}>
      {/* <SearchInputComponent onChange={() => null} searchInputStyle={clasess.searchInputContainer} /> */}
      <div style={{ width: "100%" }} />
      <div style={clasess.rightSideContainer}>
        <IconButton data-tour={'start-tour-btn'} onClick={() => {
          onClickHelpButton()
        }}>
          <HelpOutlineIcon/>
        </IconButton>
        {QuoteIfExist == true && window.location.pathname != "/quote" && (
          <IconButton onClick={() => navigate("/quote")}>
            <CartIcon />
          </IconButton>
        )}
        {/* <IconButton>
                    <Messages />
                </IconButton> */}
        {/* <IconButton onClick={handleClickNotify}>
          <Notifications />
        </IconButton> */}
        <div style={clasess.profileContainer}>
          <IconButton onClick={handleClick}>{userAvatar()}</IconButton>
          {/* <div style={clasess.userNameStyle}>{user?.displayName}</div> */}
        </div>
      </div>
      <GoMakeMenu handleClose={handleClose} open={open} anchorEl={anchorEl}>
        <div style={clasess.mainMenuContainer}>
          <div style={clasess.accountTextStyle}>{t("login.account")}</div>
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
            onMouseDown={(e) => {
              if (e.button === 1) {
                window.open("/settings/profile", "_blank");
              }
            }}
          >
            <div style={clasess.manageAccountStyle}>
              <div style={clasess.manageAccountTextStyle}>
                {t("login.manageAccount")}
              </div>
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
            <div style={clasess.logoutContainer}>{t("login.logOut")}</div>
          </MenuItem>
        </div>
      </GoMakeMenu>

      <GoMakeMenu
        handleClose={handleCloseNotify}
        open={openNotify}
        anchorEl={anchorNotifyEl}
      >
        <div style={clasess.mainMenuContainer2}>
          <div style={clasess.notificationTextStyle}>{t("Notifications")}</div>
          <MenuItem style={clasess.menuItemContainer}>
            <ColoredCycle
              backgroundColor={successColor(400)}
              size={"8px"}
            ></ColoredCycle>
            <Stack direction="column" gap={"8px"}>
              <div style={clasess.menuItemTextStyle}>
                <h3 style={clasess.textStyle}>
                  Follow up for jobs that you started it
                </h3>
              </div>
              <Stack direction="row" gap={"8px"} padding={"0px 0px 0px 64px"}>
                <SecondaryButton
                  variant="contained"
                  style={clasess.acceptBtnStyle}
                >
                  Accept
                </SecondaryButton>
                <SecondaryButton
                  variant="outlined"
                  style={clasess.rejectBtnStyle}
                >
                  Reject
                </SecondaryButton>
              </Stack>
              <h3 style={clasess.subTextStyle}>Today at 9:42 AM</h3>
            </Stack>
          </MenuItem>
          <div style={clasess.lineContainer} />
          <MenuItem style={clasess.menuItemContainer}>
            <ColoredCycle
              backgroundColor={successColor(400)}
              size={"8px"}
            ></ColoredCycle>
            <Stack direction="column" gap={"8px"} width={"95%"}>
              <div style={clasess.menuItemTextStyle}>
                <h3 style={clasess.textStyle}>
                  Your quote just has been{" "}
                  <span style={{ color: successColor(500) }}>approved</span>,
                  you can move to next step
                </h3>
              </div>
              <h3 style={clasess.subTextStyle}>Yesterday at 11:42 PM</h3>
            </Stack>
          </MenuItem>
          <div style={clasess.lineContainer} />
          <MenuItem style={clasess.menuItemContainer}>
            <ColoredCycle
              backgroundColor={warningColor(400)}
              size={"8px"}
            ></ColoredCycle>
            <Stack direction="column" gap={"8px"} width={"95%"}>
              <div style={clasess.menuItemTextStyle}>
                <h3 style={clasess.textStyle}>
                  your newest quotes is waiting for payment, check your quote
                  process
                </h3>
              </div>
              <h3 style={clasess.subTextStyle}>Yesterday at 11:42 PM</h3>
            </Stack>
          </MenuItem>
          <div style={clasess.lineContainer} />
          <MenuItem style={clasess.menuItemContainer}>
            <ColoredCycle
              backgroundColor={primaryColor(400)}
              size={"8px"}
            ></ColoredCycle>
            <Stack direction="column" gap={"8px"} width={"95%"}>
              <div style={clasess.menuItemTextStyle}>
                <h3 style={clasess.textStyle}>
                  a quote that you created it need for manager approval, stay
                  tuned for new events
                </h3>
              </div>
              <h3 style={clasess.subTextStyle}>Yesterday at 11:42 PM</h3>
            </Stack>
          </MenuItem>
          <div style={clasess.lineContainer} />
          <MenuItem style={clasess.footerItemContainer}>
            <div style={clasess.footerTextStyle}>{t("Mark all as read")}</div>
            <MarkIcon />
          </MenuItem>
        </div>
      </GoMakeMenu>
    </div>
  );
};
export { HeaderWidget };
