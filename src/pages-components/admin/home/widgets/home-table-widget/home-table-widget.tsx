import { useQuoteWidget } from "../quote-widget/use-quote-widget";
import { useStyle } from "./style";
import { PrimaryTabsComponent } from "@/components/tabs/primary-tabs";
import {DOCUMENT_TYPE} from "@/pages-components/quotes/enums";

const HomeTableWidget = () => {

    const { tabs } = useQuoteWidget(DOCUMENT_TYPE.quote);
    const { classes } = useStyle();

    return (
        <div style={classes.mainContainer}>
            <PrimaryTabsComponent tabs={tabs} variant="ButtonedTabs" />
        </div>
    );
};

export { HomeTableWidget };