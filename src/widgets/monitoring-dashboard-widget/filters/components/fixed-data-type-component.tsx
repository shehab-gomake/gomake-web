import {
  List,
  ListItemButton,
  Menu,
  MenuItem,
  IconButton,
  Box,
  Tooltip,
} from "@mui/material";
import { useState, useMemo } from "react";
import { useRecoilState } from "recoil";
import { useTranslation } from "react-i18next";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import CloseIcon from "@mui/icons-material/Close";
import { selectedDataTypeState } from "../states/selected-data-type";
import { useStyle } from "./style";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

export enum CalculationDataTypeEnum {
  DataWithPriceAndCostCalculatedByGoMake = 0,
  DataWithPriceAndEstimatedCostByGoMake,
}

const FixedDataType = () => {
  const { classes } = useStyle();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedType, setSelectedType] = useRecoilState(selectedDataTypeState);
  const { t } = useTranslation();

  const open = Boolean(anchorEl);

  const options = useMemo(
    () => [
      {
        label: "dashboard.allDataType2",
        value: null,
      },
      {
        label: "dashboard.datawithPriceAndCostCalculatedByGoMake",
        value: CalculationDataTypeEnum.DataWithPriceAndCostCalculatedByGoMake,
      },
      /*{
        label: "dashboard.dataWithPriceAndCostEnteredByUser",
        value: CalculationDataTypeEnum.DataWithPriceAndCostEnteredByUser,
      },*/
      {
        label: "dashboard.dataWithPriceAndEstimatedCostByGoMake",
        value: CalculationDataTypeEnum.DataWithPriceAndEstimatedCostByGoMake,
      },
      // {
      //   label: "dashboard.calculatedOnly",
      //   value: CalculationDataTypeEnum.CalculatedOnly,
      // },
      // {
      //   label: "dashboard.estimatedOnly",
      //   value: CalculationDataTypeEnum.EstimatedOnly,
      // },
    ],
    []
  );

  const selectedLabel = useMemo(() => {
    const selected = options.find((opt) => opt.value === selectedType);
    return selected ? t(selected.label) : t("dashboard.dataType");
  }, [selectedType, options, t]);

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedType(null);
  };

  return (
    <div>
      <List component="nav">
        <ListItemButton style={{ ...classes.listItemButton, }} onClick={handleClick}>
          <Box sx={classes.boxStyle}>
            <span style={classes.buttonLabel}>{selectedLabel}</span>

            {selectedType !== null && (
              <Tooltip
                title={
                  selectedType === CalculationDataTypeEnum.DataWithPriceAndCostCalculatedByGoMake
                    ? t("dashboard.calculatedOnlyDesc")
                    : t("dashboard.estimatedOnlyDesc")
                }
                placement="top"
                arrow
              >
                <IconButton size="small" style={{ padding: 2 }}>
                  <InfoOutlinedIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}

            {selectedType !== null && (
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
        onClose={() => setAnchorEl(null)}
        PaperProps={{
          sx: {
            width: "380px",
          },
        }}
      >
        {options.map((option) => (
          <MenuItem
            key={option.value}
            selected={selectedType === option.value}
            onClick={() => {
              setSelectedType(option.value);
              setAnchorEl(null);
            }}
          >
            {t(option.label)}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

export { FixedDataType };
