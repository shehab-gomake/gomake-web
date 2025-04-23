import {useMemo} from "react";
import {FONT_FAMILY} from "@/utils/font-family";
import {useGomakeTheme} from "@/hooks/use-gomake-thme";

const useStyle = () => {
    const {theme} = useGomakeTheme();
    const classes = useMemo(() => {
        return {
            container: {},
            button: {
                width: '163px',
                height: '36px',
                borderRadius: '8px',
                border: '1px solid rgba(208, 213, 221, 1)',
                backgroundColor: '#FFF',
                ...FONT_FAMILY.Lexend(500,16),
                cursor: 'pointer',
                color: 'rgba(52, 64, 84, 1)',
                display: 'flex',
                alignItems: 'center' as 'center',
                justifyContent: 'center' as 'center',
                gap: '4px',
                textTransform: 'none' as 'none',
                boxShadow: 'none',
                lineHeight: '1',
            },
            machineName: {
                ...FONT_FAMILY.Lexend(500, 12)
            },
            searchInput: {
                maxWidth: '200px',
                margin: '5px'
            }

        };
    }, [theme]);
    return {
        classes,
    };
};
export {useStyle};
