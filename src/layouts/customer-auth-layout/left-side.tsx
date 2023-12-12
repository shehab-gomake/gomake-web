import Image from "next/image";
import { useTranslation } from "react-i18next";
import { useStyle } from "./style";
import { Tab } from "./tab";
import { useAuthLayoutHook } from "./use-auth-layout-hook";
import { useRecoilState } from "recoil";
import { navStatusState } from "@/store/nav-status";
import { BackNavIcon } from "@/icons/back-nav";
import { adaptRight } from "@/utils/adapter";
import { hoverStatusState, permissionsState } from "@/store";
import LockIcon from "@mui/icons-material/Lock";
import { usePermission } from "@/hooks/use-permission";
import { useEffect } from "react";
const LeftSideLayout = (customGap) => {
  const { t } = useTranslation();

  const { tabs1, tabs2, tabs3, profile } = useAuthLayoutHook();

  const [navStatus, setNavStatus] = useRecoilState(navStatusState);
  const [isHover, setIsHover] = useRecoilState(hoverStatusState);
  const { CheckPermission } = usePermission();
  const { clasess } = useStyle({ navStatus, customGap });
  useEffect(() => {
    debugger;
    const isHover = localStorage.getItem("isHover");
    if (isHover && isHover == "true") {
      setIsHover(true);
      setNavStatus({ isClosed: false });
    }
  }, []);
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
        <Image
          // src={"https://i.ibb.co/wzpwSq6/Group-1239.png"}
          src={
            profile.logo
              ? profile.logo
              : "https://i.ibb.co/wzpwSq6/Group-1239.png"
          }
          alt="logo"
          width={80}
          height={80}
        />
      </div>

      <div style={clasess.tabsContainer}>
        {tabs1.map((tab) => {
          if (tab.isLine) {
            return (
              <div style={clasess.lineContainer}>
                <div key={tab.key} style={clasess.line} />
              </div>
            );
          } else {
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
            } else if (
              tab.Permission !== null &&
              CheckPermission(tab.Permission) === true
            ) {
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
