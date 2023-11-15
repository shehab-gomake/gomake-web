import * as React from "react";
import { styled } from "@mui/material/styles";
import Switch, { SwitchProps } from "@mui/material/Switch";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { useTranslation } from "react-i18next";


 const PrimeSwitchStyled = styled((props: SwitchProps & { colorX?: string, direction?: string }) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple  {...props} />
))(({ theme, colorX, direction }) => ({
  width: 36,
  height: 20,
  padding: 0,
  marginRight: direction == "ltr" ? '8px' : '0px',
  marginLeft: direction == "rtl" ? '8px' : '0px',
  '& .MuiSwitch-switchBase': {
    padding: 0,
    margin: 2,
    transitionDuration: '300ms',
    '&.Mui-checked': {
      transform: 'translateX(16px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        backgroundColor: theme.palette.mode === 'dark' ? '#2ECA45' : colorX,
        opacity: 1,
        border: 0,
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: 0.5,
      },
    },
    '&.Mui-focusVisible .MuiSwitch-thumb': {
      color: '#33cf4d',
      border: '6px solid #fff',
    },
    '&.Mui-disabled .MuiSwitch-thumb': {
      color:
        theme.palette.mode === 'light'
          ? theme.palette.grey[100]
          : theme.palette.grey[600],
    },
    '&.Mui-disabled + .MuiSwitch-track': {
      opacity: theme.palette.mode === 'light' ? 0.7 : 0.3,
    },
  },
  '& .MuiSwitch-thumb': {
    boxSizing: 'border-box',
    width: 16,
    height: 16,

  },
  '& .MuiSwitch-track': {
    borderRadius: 24 / 2,
    backgroundColor: theme.palette.mode === 'light' ? '#E9E9EA' : '#39393D',
    opacity: 1,
    transition: theme.transitions.create(['background-color'], {
      duration: 500,
    }),
  },
}));

export const PrimeSwitch = ({ ...props }) => {
  const { primaryColor } = useGomakeTheme();
  const { t } = useTranslation();
  const dir: 'rtl' | 'ltr' = t('direction');

  return <PrimeSwitchStyled {...props} colorX={primaryColor(600)} direction={dir} />;
};