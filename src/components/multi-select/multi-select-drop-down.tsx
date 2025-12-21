import { FormEvent, useState } from "react";
import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  MenuItem,
  Button,
  MenuProps,
  Menu,
  styled,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { GomakeTextInput } from "@/components";
import { useStyle } from "./style";
import { useTranslation } from "react-i18next";
import { PrimaryCheckbox } from "../check-box/primary-check-box";

interface Item<T = string | number> {
  id: T;
  label: string;
  readOnly?: boolean;
}

interface MultiSelectDropdownProps<T = string | number> {
  items: Item<T>[];
  selectedIds: T[];
  onToggle: (id: T) => void;
  onToggleAll: () => void;
  buttonLabel: string;
  placeholder?: string;
  buttonStyle?: React.CSSProperties;
}

const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: props.dir === "rtl" ? "right" : "left",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: props.dir === "rtl" ? "right" : "left",
    }}
    {...props}
  />
))(() => ({
  "& .MuiPaper-root": {
    borderRadius: 6,
    width: "250px",
    height: "fit-content",
    maxHeight: "unset",
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    "& .MuiMenu-list": {
      padding: 0,
    },
    "& .MuiMenuItem-root": {
      fontSize: "12px",
      color: "#12133A",
      padding: 0,
    },
    "& .MuiFormControlLabel-root": {
      margin: 0,
    },
  },
}));

export const MultiSelectDropdown = <T extends string | number>({
  items,
  selectedIds,
  onToggle,
  onToggleAll,
  buttonLabel,
  placeholder = "Search",
  buttonStyle,
}: MultiSelectDropdownProps<T>) => {
  const { classes } = useStyle();
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [filter, setFilter] = useState("");

  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleFilterChange = (event: FormEvent<HTMLInputElement>) => {
    setFilter(event.currentTarget.value);
  };

  const filteredItems = filter
    ? items.filter((item) =>
        item.label.toLowerCase().includes(filter.toLowerCase())
      )
    : items;

  const isAllSelected = filteredItems?.every((item) =>
    selectedIds.includes(item.id)
  );

  return (
    <>
      <Button
        style={{ ...classes.button, ...buttonStyle }}
        variant="contained"
        onClick={handleClick}
      >
        <span>{buttonLabel}</span>
        <KeyboardArrowDownIcon />
      </Button>
      <StyledMenu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <div
          style={{
            padding: "10px 10px 0px 10px",
            borderBottom: "1px solid #eee",
            background: "#fff",
            position: "sticky",
            top: 0,
            zIndex: 10,
          }}
        >
          <GomakeTextInput
            placeholder={t(placeholder)}
            value={filter}
            onChange={handleFilterChange}
          />
          <MenuItem disableRipple>
            <FormControlLabel
              label={t("deposits.selectAll")}
              control={
                <PrimaryCheckbox
                  checked={isAllSelected}
                  onChange={onToggleAll}
                />
              }
            />
          </MenuItem>
        </div>

        <div style={{ maxHeight: "300px", overflowY: "auto" }}>
          <FormGroup>
            {filteredItems?.map((item) => (
              <MenuItem key={item.id} disableRipple>
                <FormControlLabel
                  label={item.label}
                  control={
                    <PrimaryCheckbox
                      checked={selectedIds.includes(item.id)}
                      onChange={() => onToggle(item.id)}
                      disabled={item.readOnly}
                    />
                  }
                />
              </MenuItem>
            ))}
          </FormGroup>
        </div>
      </StyledMenu>
    </>
  );
};
