import { useQuoteWidget } from "../quote-widget/use-quote-widget";
import { useStyle } from "./style";
import { PrimaryTabsComponent } from "@/components/tabs/primary-tabs";

const HomeTableWidget = () => {

    const { tabs } = useQuoteWidget({});
    const { classes } = useStyle();

    return (
        <div style={classes.mainContainer}>
            <PrimaryTabsComponent tabs={tabs} variant="ButtonedTabs" />
        </div>
    );
};

export { HomeTableWidget };