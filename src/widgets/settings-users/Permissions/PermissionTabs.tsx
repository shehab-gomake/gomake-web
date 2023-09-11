
import { ITabsProps } from "@/components/tabs/interface";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { convertWidthToVW } from "@/utils/adapter";
import { FONT_FAMILY } from "@/utils/font-family";
import { useState } from "react";
import Stack from "@mui/material/Stack";
import {Tab, TabProps, Tabs, TabsProps} from "@mui/material";
import styled from "styled-components";
import { CustomTabPanel } from "../tabs";

const SecondaryTabs = styled(Tabs)((props: TabsProps) => {
    const {secondColor} = useGomakeTheme();
    return {
        paddingLeft: convertWidthToVW(20),
        paddingRight: convertWidthToVW(20),
        '& .MuiTabs-indicator': {
            borderBottom: `3px solid ${secondColor(500)}`,
        },
        '& .MuiButtonBase-root': {
            textTransform: 'initial',
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
        },
    }
});

const PermissionTabs = ({tabs}: ITabsProps) => {

    const [value, setValue] = useState(0);
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    return (
        <>
            <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'} position={'sticky'} top={0}
                   bgcolor={'#FFF'} zIndex={1}>
                <SecondaryTabs
                    value={value}
                    onChange={handleChange}>
                    {
                        tabs?.map(tab => <SecondaryTab label={tab.title}/>)
                    }
                </SecondaryTabs>
        
            </Stack>
            <div style={{padding: '0 20px'}}>
                {
                    tabs?.map((tab, index: number) => <CustomTabPanel key={'tabs' + index} value={value} index={index}>
                        {tab.component}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'flex-end' as 'flex-end',
                            position: 'sticky' as 'sticky',
                            bottom: 0
                        }}>
                        </div>
                    </CustomTabPanel>)
                }
            </div>
        </>
    );






};
export {SecondaryTab, SecondaryTabs, PermissionTabs}

