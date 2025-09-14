import React, { useState, useEffect, useMemo } from "react";
import { PrimaryTabsComponent } from "@/components/tabs/primary-tabs";
import { ITab } from "@/components/tabs/interface";
import { GmailInboxView } from "@/widgets/frontdesk/components/gmail-inbox-view";
import { SideList } from "@/components/containers/side-container/side-list/side-list";
import { SideBarContainer } from "@/components/containers/side-container/side-bar-container";
import { IListItem } from "@/components/containers/interface";
import { SmsIcon } from "@/components/icons/sms-icon";
import { PeopleIcon } from "@/components/icons/people-icon";
import { DocumentIcon } from "@/components/icons/document-icon";
import { SettingsIcon } from "@/icons/settings-icon";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";

const FrontdeskWidget: React.FC = () => {
  const { t } = useTranslation();
  const { push, query } = useRouter();
  const { frontdeskRoute, provider } = query as {
    frontdeskRoute?: string;
    provider?: string;
  };
  const [selected, setSelected] = useState<IListItem>();

  // Provider tabs inside Inbox
  const providerTabs: ITab[] = useMemo(
    () => [
      { title: "Unified", component: <GmailInboxView /> },
      { title: "Gmail", component: <GmailInboxView /> },
      { title: "WhatsApp", component: <div>WhatsApp Inbox (placeholder)</div> },
      { title: "Internal", component: <div>Internal Inbox (placeholder)</div> },
    ],
    []
  );

  // route <-> provider tab mapping
  const providerSlugs = ["unified", "gmail", "whatsapp", "internal"] as const;
  const selectedProviderIndex = useMemo(() => {
    if (frontdeskRoute !== "inbox") return 0;
    const slug = (provider ?? "unified").toString().toLowerCase();
    const idx = providerSlugs.indexOf(slug as any);
    return idx >= 0 ? idx : 0;
  }, [frontdeskRoute, provider]);
  const onSelectProvider = (index: number) => {
    const slug = providerSlugs[index] ?? providerSlugs[0];
    push(`/frontdesk/inbox/${slug}`).then();
  };

  // Components for each section
  const InboxComponent = () => (
    <PrimaryTabsComponent
      tabs={providerTabs}
      selectedColor="secondary"
      selectedTabIndex={selectedProviderIndex}
      onSelectTab={onSelectProvider}
    />
  );
  const AssignedComponent = () => <div>Work Board (placeholder)</div>;
  const AdminComponent = () => <div>Provider Accounts (placeholder)</div>;
  const SettingsComponent = () => <div>User Settings (placeholder)</div>;

  // Side list items
  const list: IListItem[] = [
    {
      component: InboxComponent,
      text: "Inbox",
      value: "1",
      icon: SmsIcon,
      path: "inbox",
    },
    {
      component: AssignedComponent,
      text: "Assigned to Me",
      value: "2",
      icon: PeopleIcon,
      path: "assigned",
    },
    {
      component: AdminComponent,
      text: "Admin",
      value: "3",
      icon: DocumentIcon,
      path: "admin",
    },
    {
      component: SettingsComponent,
      text: "Settings",
      value: "4",
      icon: SettingsIcon,
      path: "settings",
    },
  ];

  const onSelectItem = (value: string) => {
    const selectedItem = list.find((item) => item.value === value);
    setSelected(selectedItem);
    if (selectedItem?.path) {
      push(`/frontdesk/${selectedItem.path}`).then();
    }
  };

  useEffect(() => {
    // Sync selected item with route, default to inbox
    const itemByRoute = frontdeskRoute
      ? list.find((x) => x.path === frontdeskRoute)
      : list[0];
    if (itemByRoute && itemByRoute.value !== selected?.value) {
      setSelected(itemByRoute);
    }
  }, [frontdeskRoute, selected?.value]);

  const Side = () => (
    <SideList
      list={list}
      selectedItem={selected?.value}
      onSelect={onSelectItem}
      title="Frontdesk"
    />
  );

  return (
    <SideBarContainer side={Side()} header={""} subHeader={""}>
      {selected && selected.component && <selected.component />}
    </SideBarContainer>
  );
};

export default FrontdeskWidget;
