import { styled } from "@mui/material/styles";
import { Tab, TabProps, Tabs, TabsProps } from "@mui/material";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";
import { CustomTabPanel } from "@/components/tabs/tab-panel";
import { ITabsProps } from "@/components/tabs/interface";
import Stack from "@mui/material/Stack";
import { SecondaryButton } from "@/components/button/secondary-button";
import { useEffect, useState } from "react";
import { useStyle } from "./style";

const ButtonTabs = styled(Tabs)(
  (props: TabsProps & { selectedColor: "primary" | "secondary" }) => {
    return {
      "& .MuiTabs-indicator": {
        backgroundColor: "transparent",
      },
      "& .MuiButtonBase-root": {
        textTransform: "initial",
        padding: "10px",
      },
      "& .MuiTabs-flexContainer": {
        gap: "10px",
      },
    };
  }
);

const ButtonTab = styled(Tab)(
  (props: TabProps & { selectedColor: "primary" | "secondary" }) => {
    const { primaryColor, secondColor } = useGomakeTheme();
    const { selectedColor } = props;
    return {
      minWidth: "auto",
      minHeight: "auto",
      backgroundColor: primaryColor(100),
      color: primaryColor(700),
      borderRadius: "4px",
      ...FONT_FAMILY.Lexend(500, 16),
      "&.Mui-selected": {
        backgroundColor:
          selectedColor === "primary" ? primaryColor(500) : secondColor(500),
        color: "#FFFFFF",
      },
    };
  }
);

const UnderlinedTabs = styled(Tabs)(
  (props: TabsProps & { selectedColor: "primary" | "secondary" }) => {
    const { primaryColor, secondColor } = useGomakeTheme();
    const { selectedColor } = props;
    const finalColor =
      selectedColor === "secondary" ? secondColor : primaryColor;
    return {
      "& .MuiTabs-indicator": {
        height: "3px",
        borderRadius: "2px",
        background: `linear-gradient(90deg, ${finalColor(500)}, ${finalColor(
          300
        )})`,
        boxShadow: `0px 2px 8px ${finalColor(300)}88`,
        transition: "all 0.3s ease",
      },
      "& .MuiButtonBase-root": {
        textTransform: "initial",
      },
    };
  }
);
const UnderlinedTab = styled(Tab)(
  (props: TabProps & { selectedColor: "primary" | "secondary" }) => {
    const { primaryColor, secondColor, neutralColor } = useGomakeTheme();
    const { selectedColor } = props;
    return {
      minWidth: "auto",
      color: neutralColor(300),
      ...FONT_FAMILY.Lexend(500, 16),
      "&:hover": {
        color:
          selectedColor === "secondary" ? secondColor(500) : primaryColor(500),
        opacity: 1,
      },
      "&.Mui-selected": {
        ...FONT_FAMILY.Lexend(500, 16),
        color:
          selectedColor === "secondary" ? secondColor(500) : primaryColor(500),
      },
    };
  }
);

const PrimaryTabsComponent = ({
  tabs,
  children,
  navigationButtons,
  onSelectTab,
  selectedColor,
  variant,
  selectedTabIndex = 0,
  withBackGround = false,
  style,
}: ITabsProps) => {
  const { classes } = useStyle();
  const [value, setValue] = useState<number>(selectedTabIndex);

  const TabComponent = variant === "ButtonedTabs" ? ButtonTab : UnderlinedTab;
  const TabsContainer =
    variant === "ButtonedTabs" ? ButtonTabs : UnderlinedTabs;

  const handleChange = (event, newValue) => {
    setValue(newValue);

    if (!!onSelectTab) {
      onSelectTab(newValue);
    }
  };

  useEffect(() => {
    setValue(selectedTabIndex);
  }, [selectedTabIndex, setValue]);

  return (
    <>
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
        position={"sticky"}
        top={0}
        zIndex={9}
        marginBottom={2}
        bgcolor={withBackGround && "#ffffff"}
        style={style}
      >
        <TabsContainer
          value={value}
          onChange={handleChange}
          selectedColor={selectedColor}
          aria-label="tabs example"
          variant="scrollable"
          scrollButtons="auto"
        >
          {tabs?.map((tab, index) => (
            <TabComponent
              key={`tab-${index}`}
              label={tab?.title}
              selectedColor={selectedColor}
            />
          ))}
        </TabsContainer>
        {children && <div>{children}</div>}
      </Stack>
      {tabs?.map((tab, index: number) =>
        tab?.component ? (
          <CustomTabPanel key={"tabs" + index} value={value} index={index}>
            {tab.component}
            <div style={classes.tabStyle}>
              {navigationButtons && index + 1 < tabs.length && (
                <SecondaryButton
                  variant={"contained"}
                  onClick={() => setValue(index + 1)}
                >
                  Next
                </SecondaryButton>
              )}
            </div>
          </CustomTabPanel>
        ) : null
      )}
    </>
  );
};

export {
  ButtonTab,
  ButtonTabs,
  UnderlinedTab,
  UnderlinedTabs,
  PrimaryTabsComponent,
};
