import * as React from "react";
import { styled } from "@mui/material/styles";
import Switch from "@mui/material/Switch";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
const SecondSwitchStyled = styled(Switch)<any>(({ colorX }: any) => ({
  "& .MuiSwitch-switchBase.Mui-checked": {
    color: colorX,
  },
  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
    backgroundColor: colorX,
  },
}));

export const SecondSwitch = ({ ...props }) => {
  const { secondColor } = useGomakeTheme();

  return <SecondSwitchStyled {...props} colorX={secondColor(500)} />;
};
