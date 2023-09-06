import {styled} from "@mui/material/styles";
import {Tab, TabProps, Tabs, TabsProps} from "@mui/material";
import {useGomakeTheme} from "@/hooks/use-gomake-thme";
import {FONT_FAMILY} from "@/utils/font-family";
import {convertWidthToVW} from "@/utils/adapter";


const AddEmployeeTabs = styled(Tabs)((props: TabsProps) => {
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
const AddEmployeeTab = styled(Tab)((props: TabProps) => {
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

export {AddEmployeeTab, AddEmployeeTabs}