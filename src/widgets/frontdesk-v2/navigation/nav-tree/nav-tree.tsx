import React from "react";
import { frontdeskV2Theme } from "../../styles/theme";
import { NavSection } from "./nav-section";
import { NavTreeConfig } from "./types";

export interface NavTreeProps extends NavTreeConfig {
  selectedItemId?: string;
  isCollapsed?: boolean;
  onItemClick?: (itemId: string) => void;
}

export const NavTree: React.FC<NavTreeProps> = ({ sections, selectedItemId, isCollapsed = false, onItemClick }) => {
  return (
    <nav
      style={{
        display: "flex",
        flexDirection: "column",
        gap: frontdeskV2Theme.spacing[1],
      }}
    >
      {sections.map((section, index) => (
        <React.Fragment key={section.id}>
          <NavSection {...section} selectedItemId={selectedItemId} isCollapsed={isCollapsed} onItemClick={onItemClick} />
          {index < sections.length - 1 && (
            <div
              style={{
                height: "1px",
                backgroundColor: frontdeskV2Theme.colors.border.default,
                margin: `${frontdeskV2Theme.spacing[2]} 0`,
              }}
            />
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};
