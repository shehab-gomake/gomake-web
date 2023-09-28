import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";

const useStyle = () => {
    const { theme } = useGomakeTheme();
    const {secondColor} = useGomakeTheme();
    const classes = useMemo(() => {
        return {
            container: {
                position: "relative" as "relative",
                display: "flex",
                flexDirection: 'column' as 'column',
                gap: "16px",
                width:"50%"
            },
            header: {
                position: 'sticky' as 'sticky',
                top: 0,
                width: '100%',
                backgroundColor: '#FFF',
                zIndex: 1,
                padding: 1,
                paddingTop: 0,
            },
            subTitleStyle: {
                fontStyle: "normal",
                lineHeight: "normal",
                color: "#ED028C",
                ...FONT_FAMILY.Lexend(600, 16),
              },
              subTitleSpanStyle: {
                fontStyle: "normal",
                lineHeight: "normal",
                ...FONT_FAMILY.Lexend(600, 11),
              },
              textAreaStyle: {
                display: "flex",
                width: "90%",
                border:"none",
                minHeight: "150px",
                padding: "5px 7px",
                boxShadow: '0px 1px 10px rgba(0, 0, 0, 0.08)',
                alignItems: "flex-start",
                gap: "16px",
                borderRadius: "4px",
    
                fontStyle: "normal",
                lineHeight: "normal",
                ...FONT_FAMILY.Lexend(500, 12)
              },
              actionBtn: {
                backgroundColor: secondColor(500),
                color: '#FFFFFF',
                '&:hover': {
                    backgroundColor: secondColor(700),
                },
                textTransform: 'capitalize'

            },
            cleanBtnStyle: {
                backgroundColor: "#F8F8F8"
              },
            
        };
    }, [theme]);
    return {
        classes,
    };
};
export { useStyle };
