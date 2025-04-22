import {
  List,
  ListItemButton,
  Menu,
  MenuItem,
  TextField,
  CircularProgress,
  IconButton,
  Box,
} from "@mui/material";
import { useState } from "react";
import { useCustomerDropDownList } from "@/hooks";
import { useRecoilState } from "recoil";
import { selectedDashClientState } from "./states/selected-client-id";
import { useTranslation } from "react-i18next";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import CloseIcon from "@mui/icons-material/Close";
import { FONT_FAMILY } from "@/utils/font-family";
import { useStyle } from "./style";

const SingleSelectSearchDropdown = () => {
  const { classes } = useStyle();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [selectedClient, setSelectedClient] = useRecoilState(
    selectedDashClientState
  );
  const { t } = useTranslation();

  const { checkWhatRenderArray, isFetching, renderOptions } =
    useCustomerDropDownList();

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSearchChange = (e: any) => {
    checkWhatRenderArray(e);
  };

  const handleSelect = (option: any) => {
    setSelectedClient(option);
    handleClose();
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedClient(null);
  };

  return (
    <div>
      <List component="nav">
        <ListItemButton
          style={{
            minWidth: "163px",
            height: "36px",
            borderRadius: "8px",
            border: "1px solid rgba(208, 213, 221, 1)",
            backgroundColor: "#FFF",
            ...FONT_FAMILY.Lexend(500, 16),
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "4px",
            textTransform: "none",
            boxShadow: "none",
            padding: "0 8px",
          }}
          onClick={handleClick}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <span style={classes.buttonLabel}>
              {selectedClient?.name ?? t("sales.quote.customer")}
            </span>
            {selectedClient && (
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

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            width: anchorEl ? anchorEl.offsetWidth : undefined,
          },
        }}
      >
        <div style={{ padding: "8px 16px" }}>
          <TextField
            placeholder={t("Search")}
            onChange={handleSearchChange}
            fullWidth
            size="small"
          />
        </div>

        {isFetching ? (
          <MenuItem disabled>
            <CircularProgress size={20} />
          </MenuItem>
        ) : (
          renderOptions().map((option: any) => (
            <MenuItem
              key={option.id}
              selected={option.id === selectedClient?.id}
              onClick={() => handleSelect(option)}
              style={{ color: option.color }}
            >
              {option.name}
            </MenuItem>
          ))
        )}
      </Menu>
    </div>
  );
};

export { SingleSelectSearchDropdown };
