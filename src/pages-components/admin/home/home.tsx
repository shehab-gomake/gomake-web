import { QuoteWidget } from "./widgets/quote-widget/quote-widget";
import { useStyle } from "./style";
import { HomeTableWidget } from "./widgets/home-table-widget/home-table-widget";
import { useHome } from "./use-home";
import { useEffect } from "react";
import { CardsWidget } from "./widgets/cards-widget/cards-widget";
import { Skeleton } from "@mui/material";
import { useRecoilValue } from "recoil";
import { homeReportsState } from "@/pages-components/quote-new/store/quote";
import { PermissionCheck } from "@/components/CheckPermission";
import { Permissions } from "@/components/CheckPermission/enum";

const HomePageComponentForAdmin = ({ isMobileScreen }) => {
  const { classes } = useStyle();
  const { setIsDisplay, isDisplay, flag, selectedClient, t, Title } = useHome();
  const allReports = useRecoilValue<any>(homeReportsState);

  useEffect(() => {
    setIsDisplay(flag);
  }, [selectedClient]);

  return (
    <div style={classes.mainContainer}>
      <div style={classes.firstRowContainer}>
        <div
          style={
            isMobileScreen
              ? classes.mobileContainerStyle
              : classes.containerStyle
          }
        >
          <div style={classes.widgetStyle}>
            <QuoteWidget isMobileScreen={isMobileScreen} title={Title} />
          </div>

          {!isMobileScreen && (
            <div style={classes.widgetStyle}>
              <PermissionCheck
                userPermission={Permissions.SHOW_HOME_PAGE_STATISTICS}
              >
                {allReports ? (
                  <CardsWidget />
                ) : (
                  <Skeleton variant="rectangular" sx={classes.skeltonStyle} />
                )}
              </PermissionCheck>
            </div>
          )}
        </div>
      </div>
      {!isMobileScreen && isDisplay && (
        <div style={classes.secondRowContainer}>
          <div style={classes.titleStyle}>
            {t("sales.quote.documents")}{" "}
            <span
              style={{
                color: "var(--theme-secondary-color, rgb(213, 214, 233))",
              }}
            >
              / {selectedClient?.name}
            </span>
          </div>
          <div style={{ marginBottom: 20 }}>
            <HomeTableWidget
              clientId={selectedClient?.id}
              clientBalance={selectedClient?.clientBalance}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export { HomePageComponentForAdmin };
