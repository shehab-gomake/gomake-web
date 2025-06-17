import { styled } from "@mui/material/styles";
import Switch from "@mui/material/Switch";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";

const SecondSwitchStyled = styled(Switch)<{ colorX: string }>(({ colorX }) => ({
  "& .MuiSwitch-switchBase.Mui-checked": {
    color: colorX,
  },
  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
    backgroundColor: colorX,
  },
}));

interface SecondSwitchProps {
  variant?: "primary" | "secondary" | "default" | string;
  [key: string]: any;
}

const SecondSwitch = ({
  variant = "secondary",
  ...props
}: SecondSwitchProps) => {
  const { secondColor, primaryColor } = useGomakeTheme();

  const getColorFromVariant = () => {
    switch (variant) {
      case "primary":
        return primaryColor(500);
      case "secondary":
        return secondColor(500);
      case "default":
        return "#ccc";
      default:
        return variant;
    }
  };

  const resolvedColor = getColorFromVariant();

  return <SecondSwitchStyled {...props} colorX={resolvedColor} />;
};

export { SecondSwitch };
