import { ITab } from "@/components/tabs/interface";
import { useStyle } from "./style";
import { PrimaryTabsComponent } from "@/components/tabs/primary-tabs";
import {DOCUMENT_TYPE} from "@/pages-components/quotes/enums";
import { QuotesListPageWidget } from "@/pages-components/quotes/quotes";
import { useTranslation } from "react-i18next";

const HomeTableWidget = () => {
    const { classes } = useStyle();
    const { t } = useTranslation();

    const tabs: ITab[] = [
        {
          title: t("home.tabs.Quotes"),
          component: (
            <QuotesListPageWidget
              documentType={DOCUMENT_TYPE.quote}
              isFromHomePage={true}
            />
          ),
        },
        {
          title: t("home.tabs.Orders"),
          component: (
            <QuotesListPageWidget
              documentType={DOCUMENT_TYPE.order}
              isFromHomePage={true}
            />
          ),
        },
      ];

    return (
        <div style={classes.mainContainer}>
            <PrimaryTabsComponent tabs={tabs} variant="ButtonedTabs" />
        </div>
    );
};

export { HomeTableWidget };