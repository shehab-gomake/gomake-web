import {useGomakeTheme} from "@/hooks/use-gomake-thme";
import {useMemo} from "react";
import {EStatus} from "@/widgets/production-floor-widget/components/status-btn";

const useStyle = () => {
    const {theme, warningColor, secondColor, successColor, errorColor} = useGomakeTheme();
    const statusColor = (status: EStatus) => {
        switch (status) {
            case EStatus.WAITING:
                return {
                    backgroundColor: warningColor(100),
                    color: warningColor(400)
                }
            case EStatus.IN_PROCESS:
                return {
                    backgroundColor: secondColor(100),
                    color: secondColor(400)
                }
            case EStatus.DONE:
                return {
                    backgroundColor: successColor(100),
                    color: successColor(400)
                }
            case EStatus.STUCK:
                return {
                    backgroundColor: errorColor(100),
                    color: errorColor(400)
                }
        }
    }
    const classes = useMemo(() => {
        return {
            container: {
                height: '35px',
                padding: '6px 12px',
                '&:hover': {
                    opacity: 0.8
                }
            },
        }
    }, [theme]);
    return {
        classes,
        statusColor
    };
};
export {useStyle};
