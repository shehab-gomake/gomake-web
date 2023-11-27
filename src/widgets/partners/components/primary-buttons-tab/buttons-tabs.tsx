import { useTranslation } from "react-i18next";
import { Stack, Tab, Tabs, ThemeProvider, createMuiTheme } from "@mui/material";
import { useState } from "react";
import { FONT_FAMILY } from "@/utils/font-family";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { useStyle } from "./style";
import { HeaderTitle } from "@/widgets/header-title";
import { DiscoverWidget } from "../discover/discover";
import { WallSectionWidget } from "../g-wall-section/collaboration-section";
import { WallTableWidget } from "../g-wall-table/g-wall-table";
import { RequestsTableWidget } from "../requests-table/requets-table";
import { HeaderRightArrowIcon, HeaderLeftArrowIcon } from "../icons/arrow-icon";
import { MyPartnersSectionWidget } from "../g-wall-section/my-partner-section";

const PrimaryButtonsTabWidget = () => {
    const { t } = useTranslation();
    const [selectedTab, setSelectedTab] = useState(0);
    const { primaryColor } = useGomakeTheme();
    const { classes } = useStyle();
    const dir: "rtl" | "ltr" = t("direction");

    const tabLabels = [
        t('partners.collaboration'),
        t('partners.myPartners'),
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
        <div style={{}}>
            <Stack direction={'row'} alignItems={"center"} gap={"10px"} marginBottom={"20px"}>
                <HeaderTitle title={t('partners.marketplace')} marginTop={"0px"} marginBottom={"0px"} />
                {dir == "ltr" ? <HeaderRightArrowIcon /> : <HeaderLeftArrowIcon />}
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
                    <MyPartnersSectionWidget />
                    {/* <h2 style={classes.headerStyle}>{t("partners.headers.requests")}</h2> */}
                    <RequestsTableWidget />
                </Stack>
            }
        </div>
    )
};
export { PrimaryButtonsTabWidget };