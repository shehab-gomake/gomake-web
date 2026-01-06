import { ISideBarContainer } from "@/components/containers/interface";
import { useStyle } from "@/components/containers/side-container/style";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import {
  adaptPaddingLeft,
  adaptPaddingRight,
  convertHeightToVH,
} from "@/utils/adapter";
import { HEADER_HEIGHT, SCREEN_HEIGHT } from "@/utils/layout-config";

const HpSideBarContainer = ({
  side,
  children,
  subHeader,
  header,
}: ISideBarContainer) => {
  const { t } = useTranslation();
  const router = useRouter();
  const direction = t("direction");
  const isPriceProfitPage =
    router.asPath === "/settings/price-profit" ||
    router.query.settingsRoute === "price-profit";

  const classes = useMemo(() => {
    return {
      mainContainer: {
        padding: "0",
        width: "100%",
        // maxHeight: convertHeightToVH(SCREEN_HEIGHT - HEADER_HEIGHT),
        height: "100%",
      },
      container: {
        display: "flex",
        padding: 0,
        paddingBottom: 0,
        minHeight: "100%",
        position: "relative" as "relative",
      },
      main: {
        width: "100%",
        ...(isPriceProfitPage
          ? {}
          : {
              padding: "28px 28px 0px 28px",
            }),
        backgroundColor: "var(--theme-bg-body-settings,#FFFFFF)",
      },
      sideList: {
        height: "93vh",
      },
      header: {
        fontFamily:
          "var(--theme-font-family-brand, 'Forma DJR UI', sans-serif)",
        fontWeight: 700,
        fontSize: "20px",
        color: "var(--theme-primary-color, #024AD8)",
        padding: "16px 0 20px 0",
      },
      subHeader: {
        fontFamily:
          "var(--theme-font-family-brand, 'Forma DJR UI', sans-serif)",
        fontWeight: 500,
        fontSize: "24px",
        color: "var(--theme-secondary-color, #568393)",
        paddingBottom: 12,
      },
    };
  }, [direction, isPriceProfitPage, router.pathname]);

  return (
    <div style={classes.mainContainer}>
      {header && <h1 style={classes.header}>{header}</h1>}
      <div style={classes.container}>
        <div style={classes.sideList}>{side}</div>
        <div style={classes.main}>
          {subHeader && <h2 style={classes.subHeader}>{subHeader}</h2>}
          <div
            style={{
              overflow: "scroll",
              maxHeight: "100%",
              height: "100%",
            }}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export { HpSideBarContainer };
