import { FormEvent, useState } from "react";
import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  MenuItem,
  Button,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { StyledMenu } from "@/widgets";
import { GomakeTextInput } from "@/components";
import { useStyle } from "./style";
import { useTranslation } from "react-i18next";

interface Item {
  id: string;
  label: string;
}

interface MultiSelectDropdownProps {
  items: Item[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  onToggleAll: () => void;
  buttonLabel: string;
  placeholder?: string;
}

export const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  items,
  selectedIds,
  onToggle,
  onToggleAll,
  buttonLabel,
  placeholder = "Search",
}) => {
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
      <Button style={classes.button} variant="contained" onClick={handleClick}>
        <span>{buttonLabel}</span>
        <KeyboardArrowDownIcon />
      </Button>
      <StyledMenu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <FormGroup>
          <div style={{ padding: "0 10px" }}>
            <GomakeTextInput
              placeholder={t(placeholder)}
              value={filter}
              onChange={handleFilterChange}
            />
          </div>
          <MenuItem>
            <FormControlLabel
              label={t("deposits.selectAll")}
              control={
                <Checkbox checked={isAllSelected} onChange={onToggleAll} />
              }
            />
          </MenuItem>
          {filteredItems?.map((item) => (
            <MenuItem key={item.id}>
              <FormControlLabel
                label={item.label}
                control={
                  <Checkbox
                    checked={selectedIds.includes(item.id)}
                    onChange={() => onToggle(item.id)}
                  />
                }
              />
            </MenuItem>
          ))}
        </FormGroup>
      </StyledMenu>
    </>
  );
};
