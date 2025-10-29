import React from "react";

export interface NavItemConfig {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: number;
  badgeVariant?: "default" | "error" | "success" | "warning";
  onClick?: () => void;
}

export interface NavSectionConfig {
  id: string;
  label: string;
  items: NavItemConfig[];
  defaultExpanded?: boolean;
}

export interface NavTreeConfig {
  sections: NavSectionConfig[];
}
