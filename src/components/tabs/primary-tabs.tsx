import {styled} from "@mui/material/styles";
import {Tab, TabProps, Tabs, TabsProps} from "@mui/material";
import {useGomakeTheme} from "@/hooks/use-gomake-thme";
import {FONT_FAMILY} from "@/utils/font-family";
import {CustomTabPanel} from "@/components/tabs/tab-panel";
import {useState} from "react";
import {ITabsProps} from "@/components/tabs/interface";
import Stack from "@mui/material/Stack";
import {SecondaryButton} from "@/components/button/secondary-button";

const PrimaryTabs = styled(Tabs)((props: TabsProps) => {
    const {primaryColor} = useGomakeTheme();
    return {
        "& .MuiTabs-indicator": {
            borderBottom: `2px solid ${primaryColor(500)}`,
        },
        "& .MuiButtonBase-root": {
            textTransform: "initial",
        },
    };
});
const PrimaryTab = styled(Tab)((props: TabProps) => {
    const {primaryColor, neutralColor} = useGomakeTheme();
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


const PrimaryTabsComponent = ({tabs, children, navigationButtons}: ITabsProps) => {
    const [value, setValue] = useState(0);
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    return (
        <>
            <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'} position={'sticky'} top={0}
                   bgcolor={'#FFF'} zIndex={1}>
                <PrimaryTabs
                    value={value}
                    onChange={handleChange}
                    aria-label="tabs example">
                    {
                        tabs?.map(tab => <PrimaryTab label={tab.title}/>)
                    }
                </PrimaryTabs>
                    <div style={{display:"flex",width:"24%",justifyContent:'space-between',alignContent:"flex-end",marginBottom:10}}>
                    {
                        
                        Array.isArray(children) ? (
                            children.map((child, index) => (
                            <div  key={index}>{child}</div>
                            ))
                        ) : (
                            <div>{children}</div>
                        )}
                    </div>
                            
            </Stack>
            {
                tabs?.map((tab, index: number) => <CustomTabPanel key={'tabs' + index} value={value} index={index}>
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
        </>
    );
}


export {PrimaryTab, PrimaryTabs, PrimaryTabsComponent};
