import {useGomakeTheme} from "@/hooks/use-gomake-thme";
import {useMemo} from "react";
import {FONT_FAMILY} from "@/utils/font-family";

const useStyle = () => {
    const {theme, primaryColor} = useGomakeTheme();
    const classes = useMemo(() => {
        return {
            primaryLabel: {
                ...FONT_FAMILY.Lexend(500, 14),
                color: primaryColor(600),
                maxWidth: 'fit-content'
            },
            secondLabel: {
                ...FONT_FAMILY.Lexend(500, 14),
                color: '#797C80',
                maxWidth: 'fit-content',
            },
            jobTitle: {
                ...FONT_FAMILY.Lexend(600, 15),
                color: '#212121',
                maxWidth: 'fit-content'
            },
            productTitle: {
                ...FONT_FAMILY.Inter(700, 15),
                color: '#101828',    
                maxWidth: "50%",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",   
            },
            kanbanColumnCircle:{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "50%",
                width: "25px",
                minWidth: "25px",
                height: "25px",
                backgroundColor: "white",
                ...FONT_FAMILY.Inter(600, 14)
            },
            kanbanColumnLabel:{
                height: "fit-content",
                width: "100%",
                 minHeight: "50px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "white",
                borderRadius: "16px 16px 0 0",
                gap: "16px", 
            }
        };
    }, [theme]);
    return {
        classes,
    };
};
export {useStyle};