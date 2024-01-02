import { QuoteWidget } from "./widgets/quote-widget/quote-widget";
import { useStyle } from "./style";
import { QuoteTableWidget } from "./widgets/quote-table-widget/quote-table-widget";
import { useHome } from "./use-home";

const HomePageComponentForAdmin = ({ isAdmin }) => {
  const { classes } = useStyle();
  const { Title } = useHome();

  return (
    <div style={classes.mainContainer}>
      <div style={classes.firstRowContainer}>
        <div style={classes.titleStyle}>{Title} </div>
        <QuoteWidget isAdmin={isAdmin} />
      </div>
      <div style={classes.secondRowContainer}>
        <div style={classes.titleStyle}>Quote output</div>
        <QuoteTableWidget isAdmin={isAdmin} />
      </div>
    </div>
  );
};

export { HomePageComponentForAdmin };
