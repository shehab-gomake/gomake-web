import { useTranslation } from "react-i18next";
import { Stack, Tab, Tabs, ThemeProvider, createMuiTheme } from "@mui/material";
import { useState } from "react";
import { FONT_FAMILY } from "@/utils/font-family";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { useStyle } from "./style";
import { HeaderTitle } from "@/widgets/header-title";
import { HeaderTitleWithSearch } from "@/widgets/header-title-with-search";
import { DiscoverWidget } from "../discover/discover";
import { WallSectionWidget } from "../g-wall-section/section";
import { WallTableWidget } from "../g-wall-table/g-wall-table";
import { RequestsTableWidget } from "../requests-table/requets-table";
import { HeaderArrowIcon } from "../icons/arrow-icon";

const PrimaryButtonsTabWidget = () => {
    const { t } = useTranslation();
    const [selectedTab, setSelectedTab] = useState(0);
    const { primaryColor } = useGomakeTheme();
    const { classes } = useStyle();

    const tabLabels = [
        t('Collaboration'),
        t('My partners'),
    ];

    const theme = createMuiTheme({
        palette: {
            secondary: {
                main: '#FFF',
            },
        },
    });

    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);
    };

    return (
        <div style={{ width: "100%" }} >
            <Stack direction={'row'} gap={'15px'} height={"100px"} alignItems={"center"}>
                <HeaderTitle title={t("Marketplace")} />
                <HeaderArrowIcon></HeaderArrowIcon>
                <ThemeProvider theme={theme}  >
                    <Tabs
                        style={classes.container}
                        value={selectedTab}
                        onChange={handleTabChange}
                        textColor="secondary"
                        TabIndicatorProps={{ style: { display: 'none' } }}
                    >
                        {tabLabels.map((label, index) => (
                            <Tab
                                key={index}
                                sx={{
                                    backgroundColor: selectedTab === index ? primaryColor(500) : primaryColor(50),
                                    color: selectedTab === index ? '#FFF' : '#3F3F3F',
                                    minHeight: '0px',
                                    height: '30px',
                                    borderRadius: '4px',
                                    padding: '10px',
                                    marginRight: '10px',
                                    textTransform: 'none',
                                    fontStyle: 'normal',
                                    ...FONT_FAMILY.Lexend(500, 16),
                                    lineHeight: 'normal',
                                    width: `${Math.min(label.length * 12, 150)}px`,
                                }}
                                label={label}
                            />
                        ))}
                    </Tabs>
                </ThemeProvider>
            </Stack>
            <DiscoverWidget></DiscoverWidget>
            {
                selectedTab == 0 &&
                <Stack direction={'column'} gap={"20px"} marginTop={"24px"} marginBottom={"24px"}>
                    <WallSectionWidget />
                    <WallTableWidget />
                </Stack>
            }
            {
                selectedTab == 1 &&
                <Stack direction={'column'} marginTop={'20px'} gap={'10px'} >
                    <h2 style={classes.headerStyle}>Requests</h2>
                    <RequestsTableWidget />
                </Stack>
            }
        </div>
    )
};
export { PrimaryButtonsTabWidget };