import {useGomakeTheme} from "@/hooks/use-gomake-thme";
import {useMemo} from "react";
import {FONT_FAMILY} from "@/utils/font-family";
import {EStatus} from "@/widgets/production-floor-widget/components/status-btn";

const useStyle = () => {
    const {theme, primaryColor, warningColor, secondColor, successColor, errorColor} = useGomakeTheme();
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
                ...FONT_FAMILY.Lexend(500, 14),
                width: '100%',
                textTransform: 'capitalize',
                justifyContent: 'center',
                boxSizing: 'border-box',
                display: 'flex'
            },
            statusLabelBg: {
                [EStatus.WAITING]: {
                    backgroundColor: warningColor(500),
                    '&:hover' : {
                        color: '#FFF',
                        backgroundColor: warningColor(600)
                    }
                },
                [EStatus.IN_PROCESS]: {
                    backgroundColor: secondColor(500),
                    '&:hover' : {
                        color: '#FFF',
                        backgroundColor: secondColor(600)
                    }
                },
                [EStatus.DONE]: {
                    backgroundColor: successColor(500),
                    '&:hover' : {
                        color: '#FFF',
                        backgroundColor: successColor(600)
                    }
                },
                [EStatus.STUCK]: {
                    backgroundColor: errorColor(500),
                    '&:hover' : {
                        color: '#FFF',
                        backgroundColor: errorColor(600)
                    }
                }
            },
            borderRadius: {
                borderRadius: '4px',            }
        };
    }, [theme]);
    return {
        classes,
    };
};
export {useStyle};
