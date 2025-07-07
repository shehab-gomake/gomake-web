import { List, ListItemButton, Menu, MenuItem } from "@mui/material";
import { useCallback, useMemo, useState } from "react";
import { useGomakeDateRange } from "@/hooks";
import { useRecoilValue } from "recoil";
import { selectedAgentsState } from "@/store/agents-state";
import { DashboardActions } from "@/store";
import { useTranslation } from "react-i18next";
import { FONT_FAMILY } from "@/utils/font-family";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";

const FixedDatesComponent = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const {
    dates,
    action,
    setTodayDateRange,
    setTomorrowDateRange,
    setLateToday,
    setLateBoardsMissions,
    setAllBoardsMissions,
    selectedDateText,
    setDateRangeBoards,
  } = useGomakeDateRange();
  const selectedAgents = useRecoilValue(selectedAgentsState);
  const { t } = useTranslation();
  const { errorColor, primaryColor } = useGomakeTheme();

  const handleClickListItem = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const options = useMemo(() => {
    return [
      //   {
      //     label: "dashboard-widget.all",
      //     selected: action === DashboardActions.ALL_BOARDS_MISSIONS,
      //     onClick: setAllBoardsMissions,
      //     color: primaryColor(900),
      //   },
      {
        label: "dashboard-widget.custom",
        selected: action === DashboardActions.DATE_RANGE_BOARDS,
        onClick: setDateRangeBoards,
        color: primaryColor(900),
      },

      {
        label: "dashboard-widget.today",
        selected: action === DashboardActions.TODAY_BOARDS_MISSIONS,
        onClick: setTodayDateRange,
        color: primaryColor(900),
      },
      {
        label: "dashboard-widget.lateTodayMissions",
        selected: action === DashboardActions.LATE_TODAY_BOARDS_MISSIONS,
        onClick: setLateToday,
        color: primaryColor(900),
      },
      {
        label: "dashboard-widget.tomorrow",
        selected: action === DashboardActions.TOMORROW_BOARDS_MISSIONS,
        onClick: setTomorrowDateRange,
        color: primaryColor(900),
      },
      {
        label: "dashboard-widget.lateMissions",
        selected: action === DashboardActions.LATE_BOARDS_MISSIONS,
        onClick: setLateBoardsMissions,
        color: errorColor(500),
      },
    ];
  }, [dates, selectedAgents]);

  const selectedOption = useCallback(() => {
    return options.find((o) => o.selected);
  }, [options]);
  return (
    <div>
      <List component="nav">
        <ListItemButton
          style={{
            minWidth: "163px",
            width: "auto",
            height: "36px",
            borderRadius: "8px",
            border: "1px solid rgba(208, 213, 221, 1)",
            backgroundColor: "#FFF",
            ...FONT_FAMILY.Lexend(500, 16),
            cursor: "pointer",
            display: "flex",
            alignItems: "center" as "center",
            justifyContent: "center" as "center",
            gap: "4px",
            textTransform: "none" as "none",
            boxShadow: "none",
            color: selectedOption()?.color,
          }}
          onClick={handleClickListItem}
        >
          <span>
            {selectedOption() ? t(selectedOption()?.label) : selectedDateText()}
          </span>
          <KeyboardArrowDownIcon />
        </ListItemButton>
      </List>
      <Menu
        anchorEl={anchorEl}
        open={open}
        PaperProps={{
          sx: {
            width: anchorEl ? anchorEl.offsetWidth : undefined, // Match menu width with button width
          },
        }}
        onClose={handleClose}
      >
        {options.map((option) => (
          <MenuItem
            key={option.label}
            style={{ color: option.color }}
            selected={option.selected}
            onClick={() => {
              option.onClick();
              handleClose();
            }}
          >
            {t(option.label)}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

export { FixedDatesComponent };
