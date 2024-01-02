import { useQuoteWidget } from "../quote-widget/use-quote-widget";
import { useStyle } from "./style";
import { PrimaryTabsComponent } from "@/components/tabs/primary-tabs";

const QuoteTableWidget = ({ isAdmin = true }) => {

    const { tabs , handleTabChange } = useQuoteWidget();
    const { classes } = useStyle();

    return (
        <div style={classes.mainContainer}>
            <PrimaryTabsComponent tabs={tabs} onSelectTab={handleTabChange} variant="ButtonedTabs" />
        </div>
    );
};

export { QuoteTableWidget };