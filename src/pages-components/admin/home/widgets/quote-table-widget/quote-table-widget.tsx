import { useStyle } from "./style";
import { useQuoteTableWidget } from "./use-quote-table-widget";
import { PrimaryTabsComponent } from "@/components/tabs/primary-tabs";

const QuoteTableWidget = ({ isAdmin = true }) => {

    const { tabs } = useQuoteTableWidget();
    const { classes } = useStyle();

    return (
        <div style={classes.mainContainer}>
            <PrimaryTabsComponent tabs={tabs} variant="ButtonedTabs" />
        </div>
    );
};

export { QuoteTableWidget };