import React, { useEffect, useState } from 'react';
import { Theme, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import { useStyle } from './style';
import { useTranslation } from 'react-i18next';

function getStyles(value: string, selectedValues: readonly string[], theme: Theme) {
  return {
    fontWeight:
      selectedValues.indexOf(value) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

interface IProps {
  label: string;
  options: { value: string, label: string }[];
  state: any;
  setState: any;
}

const DaysOfWork = ({ label, state, setState, options }: IProps) => {
  const theme = useTheme();
  const { classes } = useStyle();
  const { t } = useTranslation();
  const dir: 'rtl' | 'ltr' = t('direction');

  const initialSelectedValues = state?.businessDays
    ? state.businessDays.split(',').map((value) =>
      options.find((option) => option.value === value)?.label || ''
    ) : [];

  const [selectedValues, setSelectedValues] = useState<string[]>(initialSelectedValues);
  useEffect(() => {
    setSelectedValues(initialSelectedValues),
      []
  });

  const MenuProps = {
    // anchorOrigin: {
    //   vertical: 'bottom',
    //   horizontal: 'left',
    // },
    // transformOrigin: {
    //   vertical: 'top',
    //   horizontal: 'left',
    // },
    PaperProps: {
      sx: classes.paperStyle,
    },
  };

  const handleChange = (event: SelectChangeEvent<typeof selectedValues>) => {
    const {
      target: { value },
    } = event;
    const selected = typeof value === 'string' ? value.split(',') : value;
    setSelectedValues(selected);
    const selectedStateValues = selected
      .map((selectedLabel) =>
        options.find((option) => option.label === selectedLabel)?.value || ''
      )
      .join(',');
    setState({
      ...state, businessDays: selectedStateValues,
    });
  };

  return (
      <FormControl sx={classes.formControlStyle} >
        <InputLabel id="demo-multiple-chip-label" style={classes.inputLbl}>{label}</InputLabel>
        <Select
          labelId="demo-multiple-chip-label"
          id="demo-multiple-chip"
          multiple
          value={selectedValues}
          onChange={handleChange}
          input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
          renderValue={(selected) => (
            <Box sx={classes.chipStyle}>
              {selected.map((value) => (
                <Chip key={value} label={value} />
              ))}
            </Box>
          )}
          MenuProps={MenuProps}
        >
          {options.map((day) => (
            <MenuItem
              key={day.value}
              value={day.label}
              style={getStyles(day.value, selectedValues, theme)}
            >
              {day.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
  );
};

export default DaysOfWork;