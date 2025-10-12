import { Badge, IconButton, MenuItem } from "@mui/material";
import { useState } from "react";
import { useGomakeAxios, useGomakeRouter } from "@/hooks";
import { GoMakeMenu } from "@/components";
import { useRecoilState, useRecoilValue } from "recoil";
import { useTranslation } from "react-i18next";
import { currentPathState } from "@/pages-components/customer-service/store/currentPathState";
import { FONT_FAMILY } from "@/utils/font-family";
import { useStyle } from "../style";
import QuestionMarkRoundedIcon from "@mui/icons-material/QuestionMarkRounded";
import { CustomTooltip } from "../../header";
import { WhatsNewModal } from "./whats-new-modal";
import { useModal } from "@/hooks/use-modal";
import { lastVersionState } from "@/store/last-version-state";
import { updateUserVersionApi } from "@/services/api-service/gomake-versioning/gomake-versioning-endpoint";
import { generateCustomerLoginLinkApi } from "@/services/api-service/support/support-endpoints";

const SystemHelp = () => {
  const { t } = useTranslation();
  const { classes } = useStyle();
  const { navigate } = useGomakeRouter();
  const whatsNewModal = useModal();
  const [version, setVersion] = useRecoilState(lastVersionState);
  const { callApi } = useGomakeAxios();

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

  const updateUserVersion = async () => {
    await updateUserVersionApi(callApi, (res) => {});
  };

  const handleWhatsNewClick = async () => {
    if (version?.isShowWhatsNewBadge) {
      await updateUserVersion();
      setVersion({
        ...version,
        isShowWhatsNewBadge: false,
        whatsNewBadgeCount: 0,
      });
    }
    whatsNewModal.open();
  };

  const handleGoSupportClick = async () => {
    await generateCustomerLoginLinkApi(callApi, (res) => {
      if (res?.success && res?.data) {
        window.open(res.data, "_blank");
      }
    });
  };

  const helpMenuList = [
    {
      name: t("header.customerSupport"),
      onclick: () =>
        navigate(`/customer-service?from=${encodeURIComponent(currentPath)}`),
    },
    {
      name: t("header.goSupport"),
      onclick: handleGoSupportClick,
    },
    {
      name: t("header.guideAndTutorial"),
      onclick: () => {
        window.open("https://know-base-qassamat.replit.app/customer", "_blank");
      },
    },
    {
      name: t("header.whatsNew"),
      onclick: handleWhatsNewClick,
    },
  ];

  return (
    <Badge
      color="error"
      overlap="circular"
      variant="dot"
      invisible={!version?.isShowWhatsNewBadge}
    >
      <CustomTooltip title={t("header.help")} arrow>
        <IconButton
          style={{ backgroundColor: "#f6f6f6", padding: "8px" }}
          data-tour={"start-tour-btn"}
          onClick={handleClickSupport}
        >
          <QuestionMarkRoundedIcon style={{ width: 22, height: 22 }} />
        </IconButton>
      </CustomTooltip>
      <GoMakeMenu
        handleClose={handleCloseSupport}
        open={openSupport}
        anchorEl={anchorSupportEl}
        noListPadding={true}
        menuOffsetY={1}
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
                {index === 3 && (
                  <Badge
                    invisible={!version?.isShowWhatsNewBadge}
                    badgeContent={
                      version?.whatsNewBadgeCount > 1
                        ? `${version.whatsNewBadgeCount}+`
                        : version?.whatsNewBadgeCount
                    }
                    color="error"
                    sx={{
                      "& .MuiBadge-badge": {
                        ...(t("direction") === "rtl"
                          ? { right: -10 }
                          : { right: 10 }),
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
      <WhatsNewModal
        open={whatsNewModal.isOpen}
        onClose={whatsNewModal.close}
        version={version}
      />
    </Badge>
  );
};
export { SystemHelp };
