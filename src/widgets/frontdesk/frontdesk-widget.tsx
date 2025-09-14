import React, { useMemo, useState } from "react";
import { SideBarContainer } from "@/components/containers/side-container/side-bar-container";
import { SideList } from "@/components/containers/side-container/side-list/side-list";
import { IListItem } from "@/components/containers/interface";
import { PrimaryTabsComponent } from "@/components/tabs/primary-tabs";
import { SecondaryTabsComponent } from "@/components/tabs/secondary-tabs";
import { ITab } from "@/components/tabs/interface";
import { FrontdeskInternalInboxTable } from "@/widgets/frontdesk/components/internal-inbox-table";
import { GmailInboxList } from "@/widgets/frontdesk/components/gmail-inbox-list";

const FrontdeskWidget: React.FC = () => {
  const [selected, setSelected] = useState<string>("overview");

  const list: IListItem[] = useMemo(
    () => [
      { text: "Overview", value: "overview" },
      { text: "Queue", value: "queue" },
      { text: "Messages", value: "messages" },
    ],
    []
  );

  const onSelect = (value: string) => setSelected(value);

  const Side = () => (
    <SideList
      list={list}
      selectedItem={selected}
      onSelect={onSelect}
      title={"Frontdesk"}
    />
  );

  const Content = () => {
    switch (selected) {
      case "queue":
        return <div style={{ padding: 16 }}>Frontdesk Queue</div>;
      case "messages":
        return <div style={{ padding: 16 }}>Frontdesk Messages</div>;
      case "overview":
      default:
        return (
          <div style={{ padding: 0 }}>
            <FrontdeskOverviewTabs />
          </div>
        );
    }
  };

  return (
    <SideBarContainer side={Side()} header={""} subHeader={""}>
      <Content />
    </SideBarContainer>
  );
};

export default FrontdeskWidget;

const FrontdeskOverviewTabs: React.FC = () => {
  const subTabs = (channel: "internal" | "gmail"): ITab[] => [
    {
      title: "Inbox",
      component: channel === "gmail" ? (
        <GmailInboxList />
      ) : (
        <div style={{ padding: 16 }}>Internal Inbox</div>
      ),
    },
    {
      title: "Assigned to me",
      component: (
        <div style={{ padding: 16 }}>
          {channel === "internal" ? "Internal" : "Gmail"} Assigned to me
        </div>
      ),
    },
  ];

  const topTabs: ITab[] = [
    {
      title: "Internal",
      component: <SecondaryTabsComponent tabs={subTabs("internal")} />,
    },
    {
      title: "Gmail",
      component: <SecondaryTabsComponent tabs={subTabs("gmail")} />,
    },
  ];

  return <PrimaryTabsComponent tabs={topTabs} withBackGround />;
};
