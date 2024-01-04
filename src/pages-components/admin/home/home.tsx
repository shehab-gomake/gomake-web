import { QuoteWidget } from "./widgets/quote-widget/quote-widget";
import { useStyle } from "./style";
import { HomeTableWidget } from "./widgets/home-table-widget/home-table-widget";
import { useHome } from "./use-home";
import { useEffect } from "react";

const HomePageComponentForAdmin = ({ isAdmin }) => {
  const { classes } = useStyle();
  const { Title ,  setIsDisplay , isDisplay , flag , selectedClient ,t} = useHome();

  useEffect(() => {
    setIsDisplay(flag);
  }, [selectedClient]);

  return (
    <div style={classes.mainContainer}>
      <div style={classes.firstRowContainer}>
        <div style={classes.titleStyle}>{Title}</div>
        <QuoteWidget isAdmin={isAdmin} />
      </div>
    { isDisplay && <div style={classes.secondRowContainer}>
        <div style={classes.titleStyle}>{t('sales.quote.documents')}</div>
        <HomeTableWidget/>
      </div>}
    </div>
  );
};

export { HomePageComponentForAdmin };
