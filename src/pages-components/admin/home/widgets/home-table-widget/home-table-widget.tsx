import { ITab } from "@/components/tabs/interface";
import { useStyle } from "./style";
import { DOCUMENT_TYPE } from "@/pages-components/quotes/enums";
import { QuotesListPageWidget } from "@/pages-components/quotes/quotes";
import { useTranslation } from "react-i18next";
import { Permissions } from "@/components/CheckPermission/enum";
import { useUserPermission } from "@/hooks/use-permission";
import { useState } from "react";
import { FONT_FAMILY } from "@/utils/font-family";
import { Stack } from "@mui/material";
import { ClientBalanceComponent } from "@/components/client-balance/client-balance";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";

const HomeTableWidget = ({
  clientId,
}: {
  clientId: string;
  clientBalance: number;
}) => {
  const { classes } = useStyle();
  const { t } = useTranslation();
  const { CheckPermission } = useUserPermission();
  const { secondColor, primaryColor } = useGomakeTheme();
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
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const _renderSelectedTab = () => {
    return (
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "center",
          gap: 25,
          marginBottom: 15,
        }}
      >
        {tabs.map((tab, index) => (
          <div
            key={index}
            onClick={() => setSelectedTab(index)} // Ensure this updates the state
            style={{
              padding: 10,
              backgroundColor:
                index === selectedTab ? secondColor(500) : primaryColor(100),
              borderRadius: 8,
              color: index === selectedTab ? "#fff" : primaryColor(700),
              ...FONT_FAMILY.Inter(500, 16),
              cursor: "pointer",
            }}
          >
            <div style={{ ...FONT_FAMILY.Inter(500, 16) }}>{tab.title}</div>
          </div>
        ))}
      </div>
    );
  };
  const _renderTabContent = () => {
    return (
      <div style={classes.mainContainer}>
        <div style={{ width: "100%" }}>
          {tabs.map((tab, index) => (
            <div key={index}>{index === selectedTab && tab.component}</div>
          ))}
        </div>
      </div>
    );
  };
  return (
    <>
      <Stack
        direction={"row"}
        alignItems={"center"}
        justifyContent={"space-between"}
      >
        {_renderSelectedTab()}
        <ClientBalanceComponent clientId={clientId} />
      </Stack>
      {_renderTabContent()}
    </>
  );
};

export { HomeTableWidget };
