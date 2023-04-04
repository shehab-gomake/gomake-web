import { useTranslation } from "react-i18next";
import { IconButton, InputAdornment } from "@mui/material";

import { GoMakeTextInputIcon } from "@/components";
import {
  Messages,
  Notifications,
  ProfileImg,
  SearchIcon,
  Statistics,
} from "@/icons";

import { useStyle } from "./style";

const HeaderWidget = () => {
  const { clasess } = useStyle();
  const { t } = useTranslation();

  return (
    <div style={clasess.container}>
      <GoMakeTextInputIcon
        style={clasess.searchInputContainer}
        placeholder={t("header.search")}
        startAdornment={
          <InputAdornment position="start">
            <div style={clasess.iconStyle}>
              <SearchIcon />
            </div>
          </InputAdornment>
        }
      />
      <div style={clasess.rightSideContainer}>
        <IconButton>
          <Statistics />
        </IconButton>
        <IconButton>
          <Messages />
        </IconButton>
        <IconButton>
          <Notifications />
        </IconButton>
        <div style={clasess.profileContainer}>
          <IconButton>
            <ProfileImg />
          </IconButton>
          <div style={clasess.userNameStyle}>Ahmed Ali</div>
        </div>
      </div>
    </div>
  );
};
export { HeaderWidget };
