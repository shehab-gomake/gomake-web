import Image from "next/image";
import { useTranslation } from "react-i18next";
import { useStyle } from "./style";
import { Tab } from "./tab";
import { useAuthLayoutHook } from "./use-auth-layout-hook";
import { useRecoilState, useRecoilValue } from "recoil";
import { navStatusState } from "@/store/nav-status";
import { adaptRight } from "@/utils/adapter";
import { hoverStatusState } from "@/store";
import LockIcon from "@mui/icons-material/Lock";
import { useUserPermission } from "@/hooks/use-permission";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { GoMakeIcon } from "@/icons/side-list-icons/gomake";
import { printHouseHasAIFeature } from "@/store/print-house-profile";

const LeftSideLayout = (customGap) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { tabs1, tabs2, tabs3, tabs4 } = useAuthLayoutHook(null, true);
  const [navStatus, setNavStatus] = useRecoilState(navStatusState);
  const [isHover, setIsHover] = useRecoilState(hoverStatusState);
  const { CheckPermission } = useUserPermission();
  const { classes } = useStyle({ navStatus, customGap });
  const [myProfileLogo, setMyProfileLogo] = useState("");
  const [hoverTimeout, setHoverTimeout] = useState(null);
  const hasAIFeature = useRecoilValue(printHouseHasAIFeature);

  useEffect(() => {
    setMyProfileLogo(localStorage.getItem("systemLogo"));
  }, []);

  useEffect(() => {
    const isHover = localStorage.getItem("isHover");
    const currentURL = window.location.href;
    const isTargetURL = currentURL.includes("goautomation.");

    if (isTargetURL) {
      setIsHover(true);
      setNavStatus({ isClosed: false });
    } else if (isHover && isHover === "true") {
      setIsHover(true);
      setNavStatus({ isClosed: false });
    }
  }, [router.asPath]);

  const checkTabPermissions = (tab) => {
    if (tab.isList && tab.list) {
      for (let i = 0; i < tab.list.length; i++) {
        if (!tab.list[i].Permission) {
          return true;
        }
        if (CheckPermission(tab.list[i].Permission)) {
          return true;
        }
      }
      return false;
    } else if (tab.Permission && !CheckPermission(tab.Permission)) {
      return false;
    }

    // ✅ Special check for GomakeAI tab: requires both permission AND AI feature
    if (tab.key === "goAI" && !hasAIFeature) {
      return false;
    }

    return true;
  };

  const handleMouseEnter = () => {
    const timeout = setTimeout(() => {
      setNavStatus({ isClosed: false });
    }, 500); // Adjust the delay (in milliseconds) here
    setHoverTimeout(timeout);
  };

  const handleMouseLeave = () => {
    clearTimeout(hoverTimeout);
  };

  const filterTabsWithPermission = (tabs: any) => {
    return tabs
      .filter((tab: any) => {
        if (tab.isLine) {
          return false;
        }
        return checkTabPermissions(tab);
      })
      .map((tab: any) => {
        if (tab.isList && tab.list) {
          tab.list = tab.list.filter((item: any) => item.Permission);
        }
        return tab;
      });
  };

  const hasTabs2 = filterTabsWithPermission(tabs2).length > 0;
  const hasTabs3 = filterTabsWithPermission(tabs3).length > 0;
  const hasTabs4 = filterTabsWithPermission(tabs4).length > 0;

  return (
    <div
      style={classes.leftContainer}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {!navStatus.isClosed && (
        <div
          style={{
            position: "absolute",
            ...adaptRight(t("direction"), 190),
            top: 15,
            cursor: "pointer",
            background: "#ccc",
            padding: 5,
            borderRadius: 200,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            opacity: isHover ? 1 : 0.7,
            width: 30,
            height: 30,
          }}
          onClick={() => {
            localStorage.setItem("isHover", !isHover + "");
            setIsHover(!isHover);
          }}
        >
          <LockIcon style={{ color: "#FFF", width: 20, height: 20 }} />
        </div>
      )}
      <Link
        href="/"
        passHref
        style={{ alignSelf: navStatus.isClosed ? "center" : "flex-start" }}
      >
        <div style={classes.logoContainer}>
          {myProfileLogo && (
            <Image
              src={myProfileLogo}
              alt="logo"
              style={{ objectFit: "contain" }}
              width={73}
              height={73}
            />
          )}
        </div>
      </Link>
      <div style={classes.tabsContainer}>
        {tabs1.map((tab, i) => {
          if (tab.isLine) {
            return (
              <div style={classes.lineContainer}>
                <div key={tab.key} style={classes.line} />
              </div>
            );
          } else if (checkTabPermissions(tab)) {
            return (
              <div data-tour={`${tab?.tourData}`}>
                <Tab key={tab.key} tab={tab} customGap={customGap} />
              </div>
            );
          }
        })}
      </div>
      <div
        style={{
          height: "100%",
          width: "100%",
          overflow: "scroll",
          alignSelf: "flex-start",
        }}
      >
        {hasTabs2 &&
          tabs2.map((tab, i) => {
            if (tab.isLine) {
              return (
                <div style={classes.lineContainer}>
                  <div key={tab.key} style={classes.line} />
                </div>
              );
            } else if (checkTabPermissions(tab)) {
              return (
                <div data-tour={`${tab?.tourData}`}>
                  <Tab key={tab.key} tab={tab} customGap={customGap} />
                </div>
              );
            }
          })}
        {hasTabs3 &&
          tabs3.map((tab, i) => {
            if (tab.isLine) {
              return (
                <div style={classes.lineContainer}>
                  <div key={tab.key} style={classes.line} />
                </div>
              );
            } else if (checkTabPermissions(tab)) {
              return (
                <div data-tour={`${tab?.tourData}`}>
                  <Tab key={tab.key} tab={tab} customGap={customGap} />
                </div>
              );
            }
          })}
        {hasTabs4 &&
          tabs4.map((tab, i) => {
            if (tab.isLine) {
              return (
                <div style={classes.lineContainer}>
                  <div key={tab.key} style={classes.line} />
                </div>
              );
            } else if (checkTabPermissions(tab)) {
              return (
                <div data-tour={`${tab?.tourData}`}>
                  <Tab key={tab.key} tab={tab} customGap={customGap} />
                </div>
              );
            }
          })}
      </div>
      <div style={{ ...classes.lineContainer, paddingBottom: "10px" }}>
        <div style={classes.line} />
      </div>
      <div style={classes.poweredContainer}>
        <div style={classes.poweredByLbl}>{t("login.poweredBy")}</div>
        <GoMakeIcon />
      </div>
    </div>
  );
};

export { LeftSideLayout };
