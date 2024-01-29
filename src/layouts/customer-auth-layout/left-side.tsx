import Image from "next/image";
import { useTranslation } from "react-i18next";
import { useStyle } from "./style";
import { Tab } from "./tab";
import { useAuthLayoutHook } from "./use-auth-layout-hook";
import { useRecoilState } from "recoil";
import { navStatusState } from "@/store/nav-status";
import { adaptRight } from "@/utils/adapter";
import { hoverStatusState } from "@/store";
import LockIcon from "@mui/icons-material/Lock";
import { useUserPermission } from "@/hooks/use-permission";
import { useEffect, useState } from "react";
const LeftSideLayout = (customGap) => {
  const { t } = useTranslation();

  const { tabs1, tabs2, tabs3 } = useAuthLayoutHook();

  const [navStatus, setNavStatus] = useRecoilState(navStatusState);
  const [isHover, setIsHover] = useRecoilState(hoverStatusState);
  const { CheckPermission } = useUserPermission();
  const { clasess } = useStyle({ navStatus, customGap });
  const [myProfileLogo, setMyProfileLogo] = useState("")
  useEffect(() => {
    setMyProfileLogo(localStorage.getItem("systemLogo"))
  }, [])
  useEffect(() => {
    const isHover = localStorage.getItem("isHover");
    if (isHover && isHover == "true") {
      setIsHover(true);
      setNavStatus({ isClosed: false });
    }
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
    }
    else if (tab.Permission && !CheckPermission(tab.Permission)) {
      return false;
    }
    return true;
  }
  return (
    <div
      style={clasess.leftContainer}
      onMouseEnter={() => {
        setNavStatus({ isClosed: false });
      }}
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
      <div style={clasess.logoContainer}>
        {myProfileLogo &&
          <Image
            src={myProfileLogo}
            alt="logo"
            width={80}
            height={80}
          />
        }
      </div>
      {/* <div style={clasess.logoContainer}>
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

      <div style={clasess.tabsContainer}>
        {tabs1.map((tab) => {
          if (tab.isLine) {
            return (
              <div style={clasess.lineContainer}>
                <div key={tab.key} style={clasess.line} />
              </div>
            );
          } else if (checkTabPermissions(tab)) {
            return <Tab key={tab.key} tab={tab} customGap={customGap} />;
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
          <div style={clasess.lineContainer}>
            <div style={clasess.line} />
          </div>
        ) : (
          [...tabs2, ...tabs3].map((tab) => {
            if (tab.isLine) {
              return (
                <div style={clasess.lineContainer} key={tab.key}>
                  <div style={clasess.line} />
                </div>
              );
            } else if (checkTabPermissions(tab)) {
              return <Tab key={tab.key} tab={tab} />;
            }
          })
        )}
      </div>
      <div style={clasess.poweredContainer}>
        <div style={clasess.poweredByLbl}>{t("login.poweredBy")}</div>
        <div style={clasess.gomakeByLbl}>{t("login.GoMake")}</div>
      </div>
    </div>
  );
};

export { LeftSideLayout };
