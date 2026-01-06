import { Badge, IconButton, MenuItem } from "@mui/material";
import { useState } from "react";
import { useGomakeAxios, useGomakeRouter } from "@/hooks";
import { GoMakeMenu } from "@/components";
import { useRecoilState } from "recoil";
import { useTranslation } from "react-i18next";
import { FONT_FAMILY } from "@/utils/font-family";
import { useStyle } from "../style";
import QuestionMarkRoundedIcon from "@mui/icons-material/QuestionMarkRounded";
import { CustomTooltip } from "../../header";
import { useTheme } from "@/contexts/theme/useTheme";
import { WhatsNewModal } from "./whats-new-modal";
import { useModal } from "@/hooks/use-modal";
import { lastVersionState } from "@/store/last-version-state";
import { updateUserVersionApi } from "@/services/api-service/gomake-versioning/gomake-versioning-endpoint";
import { generateCustomerLoginLinkApi } from "@/services/api-service/support/support-endpoints";
import { TermModal } from "@/widgets/login/terms-modal/TermModal";

const SystemHelp = () => {
  const { t } = useTranslation();
  const { classes } = useStyle();
  const { navigate } = useGomakeRouter();
  const whatsNewModal = useModal();
  const termsModal = useModal();
  const [version, setVersion] = useRecoilState(lastVersionState);
  const { callApi } = useGomakeAxios();
  const { getIconOverride, currentTheme } = useTheme();

  // Get theme-aware Help icon (HP Client icon when theme is active)
  const HpHelpIcon = getIconOverride("HelpIcon");

  // Make background color theme-aware: transparent for HP theme, default gray for others
  const iconButtonBackground =
    currentTheme === "hp-client" ? "transparent" : "#f6f6f6";

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
    await updateUserVersionApi(callApi, (res) => { });
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

  const handleGoSupportClick = async (redirect?: "tickets" | "articles") => {
    await generateCustomerLoginLinkApi(
      callApi,
      (res) => {
        if (res?.success && res?.data) {
          window.open(res.data, "_blank");
        }
      },
      redirect ? { redirect } : undefined
    );
  };

  const handleTermsClick = () => {
    handleCloseSupport();
    termsModal.open();
  };

  const helpMenuList = [
    {
      name: t("header.guideAndTutorial"),
      onclick: () => navigate("/help-center"),
    },
    {
      name: t("header.whatsNew"),
      onclick: handleWhatsNewClick,
    },
    {
      name: t("tabs.myTickets"),
      onclick: () => navigate("/my-tickets"),
    },
    {
      name: t("tabs.gomakeTerms"),
      onclick: handleTermsClick,
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
          style={{ backgroundColor: iconButtonBackground, padding: "8px" }}
          data-tour={"start-tour-btn"}
          onClick={handleClickSupport}
        >
          {HpHelpIcon ? (
            <HpHelpIcon width={22} height={22} />
          ) : (
            <QuestionMarkRoundedIcon style={{ width: 22, height: 22 }} />
          )}
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
                {index === 2 && (
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
      <TermModal
        open={termsModal.isOpen}
        onClose={termsModal.close}
        setIsTermsAccepted={() => { }}
        setIsModalOpen={termsModal.close}
        isQuickSetup={true}
      />
    </Badge>
  );
};
export { SystemHelp };
