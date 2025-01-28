import {ITab} from "@/components/tabs/interface";
import {useStyle} from "./style";
import {PrimaryTabsComponent} from "@/components/tabs/primary-tabs";
import {DOCUMENT_TYPE} from "@/pages-components/quotes/enums";
import {QuotesListPageWidget} from "@/pages-components/quotes/quotes";
import {useTranslation} from "react-i18next";
import {Permissions} from "@/components/CheckPermission/enum";
import {useUserPermission} from "@/hooks/use-permission";

const HomeTableWidget = () => {
    const {classes} = useStyle();
    const {t} = useTranslation();
    const {CheckPermission} = useUserPermission();
    const tabs: (ITab & { permission?: boolean })[] = [
        {
            title: t("home.tabs.Quotes"),
            permission: true,
            component: (
                <QuotesListPageWidget
                    documentType={DOCUMENT_TYPE.quote}
                    isFromHomePage={true}
                />
            ),
        },
        {
            title: t("home.tabs.Orders"),
            permission: true,
            component: (
                <QuotesListPageWidget
                    documentType={DOCUMENT_TYPE.order}
                    isFromHomePage={true}
                />
            ),
        },
        {
            title: t("tabs.invoices"),
            permission: CheckPermission(Permissions.SHOW_INVOICES),
            component: (
                <QuotesListPageWidget
                    documentType={DOCUMENT_TYPE.invoice}
                    isFromHomePage={true}
                />
            ),
        },
        {
            title: t("tabs.deliveryNotes"),
            permission: CheckPermission(Permissions.SHOW_DELIVERY_NOTES),
            component: (
                <QuotesListPageWidget
                    documentType={DOCUMENT_TYPE.deliveryNote}
                    isFromHomePage={true}
                />
            ),
        },
        {
            title: t("tabs.receipts"),
            permission: CheckPermission(Permissions.SHOW_RECEIPTS),
            component: (
                <QuotesListPageWidget
                    documentType={DOCUMENT_TYPE.receipt}
                    isFromHomePage={true}
                />
            ),
        },
    ].filter((tab) => tab.permission);

    return (
        <div style={classes.mainContainer}>
            <PrimaryTabsComponent tabs={tabs} variant="ButtonedTabs"/>
        </div>
    );
};

export {HomeTableWidget};