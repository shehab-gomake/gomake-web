import { QuoteWidget } from "./widgets/quote-widget/quote-widget";
import { useStyle } from "./style";
import { HomeTableWidget } from "./widgets/home-table-widget/home-table-widget";
import { useHome } from "./use-home";
import { useEffect } from "react";
import { ChartWidget } from "./widgets/chart-widget/chart-widget";

const HomePageComponentForAdmin = ({ isAdmin }) => {
  const { classes } = useStyle();
  const { Title, setIsDisplay, isDisplay, flag, selectedClient, t } = useHome();
  console.log("selectedClient", selectedClient);
  useEffect(() => {
    setIsDisplay(flag);
  }, [selectedClient]);

  return (
    <div style={classes.mainContainer}>
      <div style={classes.firstRowContainer}>
        <div style={classes.titleStyle}>{Title}</div>
        <div style={classes.containerStyle}>
          <div style={classes.widgetStyle}>
            <QuoteWidget isAdmin={isAdmin} />
          </div>
          <div style={classes.widgetStyle}>
            {/* <ChartWidget />*/}
          </div>
        </div>
      </div>

      {isDisplay && (
        <div style={classes.secondRowContainer}>
          <div style={classes.titleStyle}>
            {t("sales.quote.documents")}{" "}
            <span style={{ color: "rgb(213, 214, 233)" }}>
              / {selectedClient?.name}
            </span>
          </div>
          <HomeTableWidget />
        </div>
      )}
    </div>
  );
};

export { HomePageComponentForAdmin };
