import {
  List,
  ListItemButton,
  Menu,
  MenuItem,
  Box,
  IconButton,
} from "@mui/material";
import { useState, useMemo } from "react";
import { useRecoilState } from "recoil";
import { useTranslation } from "react-i18next";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import CloseIcon from "@mui/icons-material/Close";
import { selectedProductionStatusesState } from "../states/selected-production-statuses";
import { useStyle } from "./style";

const FixedProductionStatus = () => {
  const { classes } = useStyle();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedStatus, setSelectedStatus] = useRecoilState(
    selectedProductionStatusesState
  );
  const { t } = useTranslation();

  const open = Boolean(anchorEl);

  // Production status values aligned with backend enum: InProcess=1, Ready=2
  const productionStatusOptions = useMemo(
    () => [
      { id: 1, label: t("dashboard-widget.inProcess") },
      { id: 2, label: t("documentStatus.Order.Ready") },
    ],
    [t]
  );

  const selectedLabel = useMemo(() => {
    const selected = productionStatusOptions.find(
      (opt) => opt.id === selectedStatus
    );
    return selected ? selected.label : t("boardMissions.productionStatus");
  }, [selectedStatus, productionStatusOptions, t]);

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedStatus(null);
  };

  return (
    <div>
      <List component="nav">
        <ListItemButton style={classes.listItemButton} onClick={handleClick}>
          <Box sx={classes.boxStyle}>
            <span style={classes.buttonLabel}>{selectedLabel}</span>
            {selectedStatus !== null && (
              <IconButton
                size="small"
                onClick={handleClear}
                style={{ padding: 0 }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            )}
          </Box>
          <KeyboardArrowDownIcon />
        </ListItemButton>
      </List>
      <Menu anchorEl={anchorEl} open={open} onClose={() => setAnchorEl(null)}>
        {productionStatusOptions.map((option) => (
          <MenuItem
            key={option.id}
            selected={selectedStatus === option.id}
            onClick={() => {
              setSelectedStatus(option.id);
              setAnchorEl(null);
            }}
          >
            {option.label}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

export { FixedProductionStatus };
