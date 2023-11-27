import {useGomakeTheme} from "@/hooks/use-gomake-thme";
import {useCallback} from "react";
import {EStatus} from "@/widgets/production-floor-widget/components/status-btn";

const useStatusColor = () => {
    const { warningColor, secondColor, successColor, errorColor, theme} = useGomakeTheme()
    const statusColor = useCallback((status: EStatus, degree: number) => {
        switch (status) {
            case EStatus.STUCK:
                return errorColor(degree);
            case EStatus.IN_PROCESS:
                return secondColor(degree);
            case EStatus.WAITING:
                return warningColor(degree);
            case EStatus.DONE:
                return successColor(degree);
        }
    }, [theme])
    return {
        statusColor
    }
}

export {useStatusColor}