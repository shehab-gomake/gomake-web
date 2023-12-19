import {useRouter} from "next/router";
import {useCallback} from "react";

const useBoardMissionDrawer = () => {
    const {query, replace} = useRouter();
    const boardMissionId = query?.boardMissionId;

    const open = useCallback(() => {
        return !!boardMissionId
    }, [boardMissionId]);

    const handleClose = () => {
        replace('/production-floor').then();
    }
    const anchor: "right" | "bottom" | "left" | "top" = 'bottom';
    return {
        open,
        handleClose,
        anchor
    }
}

export {useBoardMissionDrawer}