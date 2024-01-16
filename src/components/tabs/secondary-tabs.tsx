import {styled} from "@mui/material/styles";
import {Tab, TabProps, Tabs, TabsProps} from "@mui/material";
import {useGomakeTheme} from "@/hooks/use-gomake-thme";
import {FONT_FAMILY} from "@/utils/font-family";
import {convertWidthToVW} from "@/utils/adapter";
import {ITabsProps} from "@/components/tabs/interface";
import {useState} from "react";
import Stack from "@mui/material/Stack";
import {CustomTabPanel} from "@/components/tabs/tab-panel";
import {SecondaryButton} from "@/components/button/secondary-button";


const SecondaryTabs = styled(Tabs)((props: TabsProps) => {
    return {
        paddingLeft: convertWidthToVW(20),
        paddingRight: convertWidthToVW(20),
        display: "flex",
        flexWrap: "wrap",
        '& .MuiButtonBase-root': {
            textTransform: 'initial',
        },
        '& .MuiTabs-indicator': {
            display: 'none',
        },
        '& .MuiTabs-flexContainer': {
            flexWrap: 'wrap',
            maxWidth: '100%'
        }


    }
});
const SecondaryTab = styled(Tab)((props: TabProps) => {
    const {secondColor, primaryColor} = useGomakeTheme();
    return {
        minWidth: 'auto',
        color: primaryColor(900),
        ...FONT_FAMILY.Lexend(500, 16),
        '&:hover': {
            color: secondColor(500),
            opacity: 1,
        },
        '&.Mui-selected': {
            ...FONT_FAMILY.Lexend(500, 16),
            color: secondColor(500),
            borderBottom: `3px solid ${secondColor(500)}`,
        },


    }
});

const SecondaryTabsComponent = ({tabs, children, navigationButtons, onSelectTab , withBackGround = true}: ITabsProps) => {
    const [value, setValue] = useState(0);
    const handleChange = (event, newValue) => {
        setValue(newValue);
        if (!!onSelectTab) {
            onSelectTab(newValue);
        }
    };
    return (
        <>
            <Stack direction={'row'} flexWrap={"wrap"} justifyContent={'space-between'} alignItems={'center'}
                   position={'sticky'} top={0}
                   bgcolor={ withBackGround && '#FFF'} zIndex={1}>
                <SecondaryTabs
                    value={value}
                    onChange={handleChange}>
                    {
                        tabs?.map(tab => <SecondaryTab label={tab.title}/>)
                    }
                </SecondaryTabs>
                <div>{children}</div>
            </Stack>
            { tabs.some(tab => !!tab.component) &&
                <div style={{padding: '0 20px'}}>
                    {
                        tabs?.filter(tab => !!tab.component).map((tab, index: number) => <CustomTabPanel
                            key={'tabs' + index} value={value} index={index}>
                            {tab.component}
                            <div style={{
                                display: 'flex',
                                justifyContent: 'flex-end' as 'flex-end',
                                position: 'sticky' as 'sticky',
                                bottom: 0
                            }}>
                                {navigationButtons && index + 1 < tabs.length && <SecondaryButton variant={'contained'}
                                                                                                  onClick={() => setValue(index + 1)}>Next</SecondaryButton>}
                            </div>
                        </CustomTabPanel>)
                    }
                </div>
            }
        </>
    );
}
export {SecondaryTab, SecondaryTabs, SecondaryTabsComponent}