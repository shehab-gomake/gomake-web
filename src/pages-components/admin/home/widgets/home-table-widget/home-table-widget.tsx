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
import { Tab, Tabs } from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledTabs = styled(Tabs)(() => {
  return {
    minHeight: "48px",
    "& .MuiTabs-indicator": {
      display: "none",
    },
    "& .MuiTabs-flexContainer": {
      gap: "8px",
    },
  };
});

const StyledTab = styled(Tab)(() => {
  const { primaryColor, secondColor, neutralColor } = useGomakeTheme();
  const primaryColorValue = primaryColor(500);
  const primaryLight = primaryColor(100);
  const primaryDisabled = primaryColor(200);

  return {
    minWidth: "auto",
    minHeight: "40px",
    padding: "8px 20px",
    textTransform: "none",
    borderRadius: "8px",
    backgroundColor: "transparent",
    color: neutralColor(600),
    border: `1px solid ${neutralColor(200)}`,
    ...FONT_FAMILY.Inter(500, 15),
    transition: "all 0.2s ease",
    "&:hover": {
      backgroundColor: `var(--theme-secondary-light, ${primaryLight})`,
      color: `var(--theme-secondary-color, ${primaryColorValue})`,
      borderColor: `var(--theme-secondary-color, ${primaryDisabled})`,
    },
    "&.Mui-selected": {
      backgroundColor: secondColor(500),
      color: "#FFFFFF",
      borderColor: "transparent",
      ...FONT_FAMILY.Inter(600, 15),
      "&:hover": {
        backgroundColor: secondColor(500),
        color: "#FFFFFF",
        borderColor: "transparent",
      },
    },
  };
});

const HomeTableWidget = ({
  clientId,
}: {
  clientId: string;
  clientBalance: number;
}) => {
  const { classes } = useStyle();
  const { t } = useTranslation();
  const { CheckPermission } = useUserPermission();

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

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  const _renderSelectedTab = () => {
    return (
      <StyledTabs
        value={selectedTab}
        onChange={handleTabChange}
        aria-label="document type tabs"
      >
        {tabs.map((tab, index) => (
          <StyledTab key={`tab-${index}`} label={tab.title} />
        ))}
      </StyledTabs>
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
        sx={{ marginBottom: "12px" }}
      >
        {_renderSelectedTab()}
        <ClientBalanceComponent clientId={clientId} />
      </Stack>
      {_renderTabContent()}
    </>
  );
};

export { HomeTableWidget };
