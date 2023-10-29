import { useTranslation } from "react-i18next";
import { Avatar, IconButton, MenuItem } from "@mui/material";

import { EditIcon } from "@/icons";

import { useStyle } from "./style";
import { useHeader } from "./use-header";
import { GoMakeMenu } from "@/components";
import { useRecoilState, useRecoilValue } from "recoil";
import { userProfileState } from "@/store/user-profile";
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { QuoteIfExistState } from "@/pages-components/quote/store/quote";

const HeaderWidget = () => {
  const { clasess } = useStyle();
  const { t } = useTranslation();
  const userProfile = useRecoilValue(userProfileState);
  const [QuoteIfExist, setQuoteIfExist] = useRecoilState<any>(QuoteIfExistState);
  console.log("QuoteIfExist in header tsx : " , QuoteIfExist)
  const { user, open, anchorEl, handleClick, handleClose, navigate , handleClickQuoteExist} =
    useHeader();
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
          <div>
            <IconButton onClick={handleClick}>{userAvatar()}</IconButton>
          </div>
          {/* <div style={clasess.userNameStyle}>{user?.displayName}</div> */}
         { Object?.keys(QuoteIfExist).length !== 0 && 
         
            <div>
              <AddShoppingCartIcon onClick={handleClickQuoteExist} sx={{ color: "#2e3092",fontSize:28}}/>
            </div>
         
         } 
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
   
    </div>
    
  );
};
export { HeaderWidget };
