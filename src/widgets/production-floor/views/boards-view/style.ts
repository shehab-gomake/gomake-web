import {useGomakeTheme} from "@/hooks/use-gomake-thme";
import {useMemo} from "react";
import {FONT_FAMILY} from "@/utils/font-family";

const useStyle = () => {
    const {theme, secondColor} = useGomakeTheme();
    const classes = useMemo(() => {
        return {
            noStationSelected:{
                width: "100%",
                alignItems: "center" as "center",
                color: secondColor(500),
                textAlign: "center" as "center",
                marginTop: 20,
                height: 42,
                lineHeight: "17.5px",
                ...FONT_FAMILY.Lexend(500, 14),
            }
        };
    }, [theme]);
    return {
        classes,
    };
};
export {useStyle};