import { Badge, IconButton, MenuItem } from "@mui/material";
import { useState } from "react";
import { useGomakeRouter } from "@/hooks";
import { GoMakeMenu } from "@/components";
import { useRecoilValue } from "recoil";
import { useTranslation } from "react-i18next";
import { HelpIcon } from "@/icons/help-icon";
import { currentPathState } from "@/pages-components/customer-service/store/currentPathState";
import { FONT_FAMILY } from "@/utils/font-family";
import { useStyle } from "../style";

const SystemHelp = () => {
  const { t } = useTranslation();
  const { classes } = useStyle();
  const { navigate } = useGomakeRouter();
  const currentPath = useRecoilValue(currentPathState);
  const [anchorSupportEl, setAnchorSupportEl] = useState<null | HTMLElement>(
    null
  );
  const openSupport = Boolean(anchorSupportEl);

  const handleClickSupport = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorSupportEl(event.currentTarget);
  };

  const handleCloseSupport = () => {
    setAnchorSupportEl(null);
  };

  const helpMenuList = [
    {
      name: t("header.customerSupport"),
      onclick: () =>
        navigate(`/customer-service?from=${encodeURIComponent(currentPath)}`),
    },
    {
      name: t("header.guideAndTutorial"),
      onclick: () => {
        window.open("https://gomake.document360.io", "_blank");
      },
    },
    {
      key: "whatsNew",
      name: t("What's New"),
      onclick: () => {},
    },
  ];

  return (
    <Badge
      color="error"
      overlap="circular"
      variant="dot"
      // invisible={!isShowCustomerBadge}
    >
      <IconButton
        style={{ padding: "2px" }}
        data-tour={"start-tour-btn"}
        onClick={handleClickSupport}
      >
        <HelpIcon width={32} height={32} />
      </IconButton>
      <GoMakeMenu
        handleClose={handleCloseSupport}
        open={openSupport}
        anchorEl={anchorSupportEl}
        noListPadding={true}
      >
        {helpMenuList?.map((item, index) => {
          return (
            <>
              <MenuItem
                key={index}
                onClick={item?.onclick}
                style={classes.menuItem}
              >
                <div style={classes.logoutContainer}>{item?.name}</div>
                {item?.key === "whatsNew" && (
                  <Badge
                    badgeContent="5+"
                    color="error"
                    sx={{
                      "& .MuiBadge-badge": {
                        right: 10,
                        ...FONT_FAMILY.Lexend(400, 13),
                        height: "18px",
                        minWidth: "18px",
                        borderRadius: "9px",
                        padding: "0 8px",
                      },
                    }}
                  />
                )}
              </MenuItem>
              {index != helpMenuList?.length - 1 ? (
                <div style={classes.lineContainer} />
              ) : null}
            </>
          );
        })}
      </GoMakeMenu>
    </Badge>
  );
};
export { SystemHelp };
