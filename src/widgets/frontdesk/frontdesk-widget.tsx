import React, { useMemo } from "react";
import { PrimaryTabsComponent } from "@/components/tabs/primary-tabs";
import { SecondaryTabsComponent } from "@/components/tabs/secondary-tabs";
import { ITab } from "@/components/tabs/interface";
import { convertWidthToVW } from "@/utils/adapter";
import { GmailInboxView } from "@/widgets/frontdesk/components/gmail-inbox-view";

const FrontdeskWidget: React.FC = () => {
  // Provider tabs inside Inbox
  const providerTabs: ITab[] = useMemo(
    () => [
      { title: "Unified", component: <GmailInboxView /> }, // Placeholder: reuse Gmail view for now
      { title: "Gmail", component: <GmailInboxView /> },
      { title: "WhatsApp", component: <div style={{ padding: 16 }}>WhatsApp Inbox (placeholder)</div> },
      { title: "Internal", component: <div style={{ padding: 16 }}>Internal Inbox (placeholder)</div> },
    ],
    []
  );

  // Top-level tabs
  const tabs: ITab[] = useMemo(
    () => [
      { title: "Inbox", component: <SecondaryTabsComponent tabs={providerTabs} /> },
      { title: "Assigned to Me", component: <div style={{ padding: 16 }}>Work Board (placeholder)</div> },
      { title: "Admin", component: <div style={{ padding: 16 }}>Provider Accounts (placeholder)</div> },
      { title: "Settings", component: <div style={{ padding: 16 }}>User Settings (placeholder)</div> },
    ],
    [providerTabs]
  );

  return (
    <PrimaryTabsComponent
      tabs={tabs}
      withBackGround
      style={{
        paddingLeft: convertWidthToVW(20),
        paddingRight: convertWidthToVW(20),
      }}
    />
  );
};

export default FrontdeskWidget;
