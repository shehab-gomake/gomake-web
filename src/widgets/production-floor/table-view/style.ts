import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { useMemo } from "react";
import { FONT_FAMILY } from "@/utils/font-family";

const useStyle = () => {
    const { theme, primaryColor } = useGomakeTheme();
    const classes = useMemo(() => {
        return {
            categoryLabel: {
                ...FONT_FAMILY.Lexend(600, 12),
                color: primaryColor(500),
                padding: '2px 12px',
                backgroundColor: primaryColor(50),
                borderRadius: 17
            },
            statusLabel: {
                color: '#FFF',
                ...FONT_FAMILY.Lexend(500, 13),
                width: '100%',
                textTransform: 'capitalize',
                justifyContent: 'center',
                boxSizing: 'border-box',
                display: 'flex',
            },
            borderRadius: {
                borderRadius: '4px',
            },
            currentStationBtn: {
                borderRadius: 0,
                border: 0,
                backgroundColor: primaryColor(500),
                '&:hover': {
                    backgroundColor: primaryColor(500),
                    opacity: 0.8
                },
                '&.Mui-disabled': {
                    backgroundColor: primaryColor(500),
                    color: "#FFF"
                }}
        };
    }, [theme]);
    return {
        classes,
    };
};
export { useStyle };