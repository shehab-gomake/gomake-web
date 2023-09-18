import { styled } from "@mui/material/styles";
import { Box, Tab, TabProps, Tabs, TabsProps, Typography } from "@mui/material";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";

const UsersSettingsTabs = styled(Tabs)((props: TabsProps) => {
  const { primaryColor } = useGomakeTheme();
  return {
    // paddingLeft: convertWidthToVW(20),
    // paddingRight: convertWidthToVW(20),
    // gap: 34,

    "& .MuiTabs-indicator": {
      borderBottom: `2px solid ${primaryColor(500)}`,
    },
    "& .MuiButtonBase-root": {
      textTransform: "initial",
    },
  };
});
const UsersSettingsTab = styled(Tab)((props: TabProps) => {
  const { primaryColor, neutralColor } = useGomakeTheme();
  return {
    minWidth: "auto",
    color: neutralColor(300),
    ...FONT_FAMILY.Lexend(500, 16),
    "&:hover": {
      color: primaryColor(500),
      opacity: 1,
    },
    "&.Mui-selected": {
      ...FONT_FAMILY.Lexend(500, 16),
      color: primaryColor(500),
    },
  };
});

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div hidden={value !== index} {...other} style={{ width: "100%" }}>
      {value === index && (
        <Box
        //   sx={{
        //     paddingLeft: convertWidthToVW(20),
        //     paddingRight: convertWidthToVW(20),
        //   }}
        >
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

export { UsersSettingsTab, UsersSettingsTabs, CustomTabPanel };
