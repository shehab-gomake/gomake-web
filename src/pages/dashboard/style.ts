import {useMemo} from "react";
import {FONT_FAMILY} from "@/utils/font-family";
import {useGomakeTheme} from "@/hooks/use-gomake-thme";

const useStyle = () => {
    const { primaryColor } = useGomakeTheme();
    const classes = useMemo(() => {
        return {
            container: {
                display: 'flex',
                flexDirection: 'column' as 'column',
                gap: '40px',
                minHeight: '100vh'
            },
            header: {
                textAlign: 'center' as 'center',
                ...FONT_FAMILY.Lexend(700, 32),
                color: primaryColor(700),
                paddingTop: '48px'
            }
        };
    }, []);
    return {
        classes,
    };
};
export {useStyle};
