import {useGomakeTheme} from "@/hooks/use-gomake-thme";
import {useMemo} from "react";
import {FONT_FAMILY} from "@/utils/font-family";

const useStyle = () => {
    const {theme, primaryColor} = useGomakeTheme();
    const classes = useMemo(() => {
        return {
            container: {},
            inputContainer: {
                display: "inline-flex",
                flexDirection: "column" as "column",
                gap: 10,
                marginTop: 40,
                paddingRight: '15px'
            },
            inputLbl: {
                color: primaryColor(900),
                ...FONT_FAMILY.Lexend(400, 14),
            },
            input: {
                width: "87%",
            },
            stepLabel: {},
            stepLabelContainer: {
                display: 'flex',
                alignItems: 'center' as 'center',
                gap: '5px',
                ...FONT_FAMILY.Lexend(500, 16),
                color: 'blue'
            },
            navigationButtons: {
                display: 'flex',
                justifyContent: 'space-between' as 'space-between',
                padding: '10px'
            }
        };
    }, [theme]);
    return {
        classes,
    };
};
export {useStyle};
