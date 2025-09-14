import React, { useMemo, useState } from "react";
import { SideBarContainer } from "@/components/containers/side-container/side-bar-container";
import { SideList } from "@/components/containers/side-container/side-list/side-list";
import { IListItem } from "@/components/containers/interface";

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
        return <div style={{ padding: 16 }}>Frontdesk Overview</div>;
    }
  };

  return (
    <SideBarContainer side={Side()} header={""} subHeader={""}>
      <Content />
    </SideBarContainer>
  );
};

export default FrontdeskWidget;
