import React from "react";
import { LayoutContainer } from "@/widgets/frontdesk-v2/styles";
import { LeftSidebar } from "./left-sidebar";
import { MiddlePanel } from "./middle-panel";
import { CenterPanel } from "./center-panel";
import { RightSidebar } from "./right-sidebar";

export const ThreeColumnLayout = () => {
  return (
    <LayoutContainer>
      <LeftSidebar />
      <MiddlePanel />
      <CenterPanel />
      <RightSidebar />
    </LayoutContainer>
  );
};
