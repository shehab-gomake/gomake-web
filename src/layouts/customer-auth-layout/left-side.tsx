import Image from "next/image";
import { useTranslation } from "react-i18next";
import { useStyle } from "./style";
import { Tab } from "./tab";
import { useAuthLayoutHook } from "./use-auth-layout-hook";
import { useRecoilState } from "recoil";
import { navStatusState } from "@/store/nav-status";
import { useUserPermission } from "@/hooks/use-permission";
import { useEffect, useState } from "react";
import { CompressIcon } from "@/icons/compress-icon";
import { ExpandIcon } from "@/icons/expand-icon";
import { styled } from "@mui/material";

const HoverableDiv = styled("div")({
  top: 15,
  cursor: "pointer",
  padding: 5,
  borderRadius: "5px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: 30,
  height: 30,
  backgroundColor: "transparent",
  "&:hover": {
    backgroundColor: "#514fa2",
  },
});

const LeftSideLayout = (customGap) => {
  const { t } = useTranslation();
  const { tabs1, tabs2, tabs3 } = useAuthLayoutHook(null, true);
  const [navStatus, setNavStatus] = useRecoilState(navStatusState);
  const { CheckPermission } = useUserPermission();
  const { classes } = useStyle({ navStatus, customGap });
  const [myProfileLogo, setMyProfileLogo] = useState("");

  useEffect(() => {
    setMyProfileLogo(localStorage.getItem("systemLogo"));
  }, []);

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
    return true;
  };

  return (
    <div style={classes.leftContainer}>
      {!navStatus.isClosed && (
        <HoverableDiv onClick={() => setNavStatus({ isClosed: true })}>
          <CompressIcon />
        </HoverableDiv>
      )}
      {navStatus.isClosed && (
        <HoverableDiv onClick={() => setNavStatus({ isClosed: false })}>
          <ExpandIcon />
        </HoverableDiv>
      )}
      <div style={classes.logoContainer}>
        {myProfileLogo && (
          <Image
            src={myProfileLogo}
            alt="logo"
            style={{ objectFit: "contain" }}
            width={80}
            height={80}
          />
        )}
      </div>
      {/* <div style={classes.logoContainer}>
        <Image
          src={
            myProfileLogo
              ? myProfileLogo
              : "https://i.ibb.co/wzpwSq6/Group-1239.png"
          }
          alt="logo"
          width={80}
          height={80}
        />
      </div> */}
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
        {tabs2.every((tab) => tab.Permission === false) ? (
          <div style={classes.lineContainer}>
            <div style={classes.line} />
          </div>
        ) : (
          [...tabs2, ...tabs3].map((tab) => {
            if (tab.isLine) {
              return (
                <div style={classes.lineContainer} key={tab.key}>
                  <div style={classes.line} />
                </div>
              );
            } else if (checkTabPermissions(tab)) {
              return (
                <div data-tour={`${tab?.tourData}`}>
                  <Tab key={tab.key} tab={tab} />
                </div>
              );
            }
          })
        )}
      </div>
      <div style={classes.poweredContainer}>
        <div style={classes.poweredByLbl}>{t("login.poweredBy")}</div>
        <div style={classes.goMakeByLbl}>{t("login.GoMake")}</div>
      </div>
    </div>
  );
};

export { LeftSideLayout };
