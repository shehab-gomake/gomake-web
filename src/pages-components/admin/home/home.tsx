import { QuoteWidget } from "./widgets/quote-widget/quote-widget";
import { useStyle } from "./style";
import { HomeTableWidget } from "./widgets/home-table-widget/home-table-widget";
import { useHome } from "./use-home";
import { useRecoilValue } from "recoil";
import { selectedClientState } from "@/pages-components/quotes/states";

const HomePageComponentForAdmin = ({ isAdmin }) => {
  const { classes } = useStyle();
  const { Title , t} = useHome();
  const selectedClient =useRecoilValue<any>(selectedClientState);

  return (
    <div style={classes.mainContainer}>
      <div style={classes.firstRowContainer}>
        <div style={classes.titleStyle}>{Title}</div>
        <QuoteWidget isAdmin={isAdmin} />
      </div>
    { selectedClient && <div style={classes.secondRowContainer}>
        <div style={classes.titleStyle}>{t("Quote output")}</div>
        <HomeTableWidget/>
      </div>}
    </div>
  );
};

export { HomePageComponentForAdmin };
