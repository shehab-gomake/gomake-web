import {useGomakeTheme} from "@/hooks/use-gomake-thme";
import {useMemo} from "react";
import {FONT_FAMILY} from "@/utils/font-family";

const useStyle = () => {
    const {theme, primaryColor, secondColor} = useGomakeTheme();
    const classes = useMemo(() => {
        return {
            header: {
                position: 'sticky' as 'sticky',
                top: 0,
                width: '100%',
                backgroundColor: '#FFF',
                zIndex: 1,
                padding: 1,
                paddingBottom: '12px'
            },
            headerBtn: {
                display: 'flex',
                justifyContent: 'flex-end' as 'flex-end',
                gap: 16
            },
            footer: {
                position: 'sticky' as 'sticky',
                bottom: 0,
                width: '100%',
                backgroundColor: '#FFF',
                zIndex: 1,
                padding: 1,
                paddingTop: '12px',
                display: 'flex',
                justifyContent: 'flex-end' as 'flex-end',
                gap: 16
            },
            addBtn: {
                ...FONT_FAMILY.Lexend(500, 16),
                backgroundColor: primaryColor(100),
                color: primaryColor(900),
                '&:hover': {
                    backgroundColor: primaryColor(200),
                },
                marginBottom: '40px'
            },
            exportBtn: {
                ...FONT_FAMILY.Lexend(500, 16),
                backgroundColor: '#FFF',
                color: secondColor(500),
                border: `1px solid ${secondColor(500)}`,
                '&:hover': {
                    backgroundColor: secondColor(500),
                    color: '#FFF'
                }
            },
            printBtn: {
                ...FONT_FAMILY.Lexend(500, 16),
                backgroundColor: secondColor(500),
                color: '#FFF',
                '&:hover': {
                    backgroundColor: secondColor(200),
                }
            }
        };
    }, [theme]);
    return {
        classes,
    };
};
export {useStyle};
