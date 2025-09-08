import { useState } from "react";
import { Box, Typography, IconButton, Select } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { FONT_FAMILY } from "@/utils/font-family";
import { IFilterGroupsList } from "../../../interfaces/borad-missions-filter-groups";
import { GroupDropdownComponentProps } from "./group-dropdown.types";
import {
  GroupDropdown,
  ColorIndicator,
  GroupMenuItem,
} from "./group-dropdown.styles";

export const GroupDropdownComponent = ({
  filterGroups,
  selectedGroupId,
  handleSelectGroup,
  handleClickMenu,
  setSelectedGroup,
  onClickOpenModalEditGroup,
  dir,
  t,
}: GroupDropdownComponentProps) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const selectedGroup = filterGroups.find(
    (group) => group.id === selectedGroupId
  );

  const handleDropdownChange = (event: any) => {
    const value = event.target.value;
    if (value === "new-group") {
      onClickOpenModalEditGroup();
    } else {
      handleSelectGroup(value);
    }
    setDropdownOpen(false);
  };

  const handleMenuClick = (
    e: React.MouseEvent<HTMLElement>,
    group: IFilterGroupsList
  ) => {
    e.stopPropagation();
    handleClickMenu(e);
    setSelectedGroup({
      id: group.id,
      name: group.name,
      inProcessCount: group.inProcessCount || 0,
      stuckCount: group.stuckCount || 0,
      color: group.color || "#7355de",
    });
  };

  return (
    <GroupDropdown dir={dir}>
      <Select
        value={selectedGroupId || ""}
        onChange={handleDropdownChange}
        open={dropdownOpen}
        onOpen={() => setDropdownOpen(true)}
        onClose={() => setDropdownOpen(false)}
        displayEmpty
        renderValue={(selected) => {
          if (!selected || !selectedGroup) {
            return (
              <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Typography
                  sx={{ color: "#9CA3AF", ...FONT_FAMILY.Inter(400, 15) }}
                >
                  {t("productionFloor.selectGroup")}
                </Typography>
              </Box>
            );
          }
          return (
            <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <ColorIndicator color={selectedGroup.color || "#7355de"} />
              <Typography sx={{ ...FONT_FAMILY.Inter(400, 15) }}>
                {selectedGroup.name}
              </Typography>
            </Box>
          );
        }}
        MenuProps={{
          PaperProps: {
            style: {
              maxHeight: "300px",
              width: "250px",
              overflowY: "auto",
            },
            sx: {
              "&::-webkit-scrollbar": {
                width: "8px",
              },
              "&::-webkit-scrollbar-track": {
                background: "white",
              },
              "&::-webkit-scrollbar-thumb": {
                background: "#EAECF0",
                borderRadius: "8px",
              },
              "&::-webkit-scrollbar-thumb:hover": {
                background: "#b0b0b0",
              },
              "&::-webkit-scrollbar-button": {
                display: "none",
              },
            },
          },
        }}
      >
        {filterGroups.map((group) => (
          <GroupMenuItem key={group.id} value={group.id}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                flex: 1,
              }}
            >
              <ColorIndicator color={group.color || "#7355de"} />
              <Typography sx={{ ...FONT_FAMILY.Inter(400, 14) }}>
                {group.name}
              </Typography>
            </Box>
            {group.id !== "all" && (
              <IconButton
                onClick={(e) => handleMenuClick(e, group)}
                size="small"
                sx={{ padding: "2px" }}
              >
                <MoreVertIcon
                  sx={{ fontSize: "16px", color: group.color || "#7355de" }}
                />
              </IconButton>
            )}
          </GroupMenuItem>
        ))}
      </Select>
    </GroupDropdown>
  );
};
