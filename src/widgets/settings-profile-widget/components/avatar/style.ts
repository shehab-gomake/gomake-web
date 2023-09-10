import {useGomakeTheme} from "@/hooks/use-gomake-thme";
import {useMemo} from "react";
import {FONT_FAMILY} from "@/utils/font-family";

const useStyle = () => {
    const {theme, primaryColor} = useGomakeTheme();
    const classes = useMemo(() => {
        return {
            avatar: {
                width: "100px",
                height: "100px",
                border: '6px solid ' + primaryColor(300),

            },
            addBtn: {
                ...FONT_FAMILY.Lexend(500, 16),
                backgroundColor: primaryColor(100),
                color: primaryColor(900),
                '&:hover': {
                    backgroundColor: primaryColor(200),
                },
                marginBottom: '20px',
                textTransform: 'capitalize'
            },
            button: {
                height: 32,
                width: 32,
                backgroundColor: primaryColor(300),
                color: 'white',
                '&:hover': {
                    backgroundColor: primaryColor(300),
                    color: 'white',
                }
            },
            menuItem: {
                display: 'flex',
                width: 125,
                justifyContent: 'space-between',
                alignItems: 'center',
                color: primaryColor(300)
            },
            icon: {
                width: 16,
                height: 16,
                color: primaryColor(300)
            },
            menuBtn: {
                display: "flex",
                alignItems: "center",
                gap: 8,
                color: primaryColor(300),
                height: '10px'
            },
            avatarTitle: {
                ...FONT_FAMILY.Lexend(500, 20),
                color: primaryColor(900),
                textTransform: 'capitalize' as 'capitalize'
            }
        };
    }, [theme]);
    return {
        classes,
    };
};
export {useStyle};
