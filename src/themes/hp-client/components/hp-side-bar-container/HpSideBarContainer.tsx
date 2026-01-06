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
        maxHeight: convertHeightToVH(SCREEN_HEIGHT - HEADER_HEIGHT),
        ...adaptPaddingLeft(direction, 20),
        ...adaptPaddingRight(direction, 0), // maybe 5
        width: "100%",
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
        paddingTop: isPriceProfitPage ? 0 : 28,
        ...(isPriceProfitPage
          ? {}
          : {
              ...adaptPaddingLeft(direction, 0),
              ...adaptPaddingRight(direction, 28),
            }),
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
        <div>{side}</div>
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
