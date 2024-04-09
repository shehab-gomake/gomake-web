import { MouseEvent} from "react";
import {useRouter} from "next/router";

const useBoardMissionsNavigationButtons = () => {
    const {query, replace, pathname} = useRouter();
    const {step} = query
    const boardMissionsViews = [
        {value: 'stations', labelKey: 'stations'},
        {value: 'files', labelKey: 'files'},
        {value: 'approval', labelKey: 'approval'},
        {value: 'activity', labelKey: 'activity'},
    ];

    const handleViewChange = (e: MouseEvent<HTMLElement>, newView: string) => {
        replace({ pathname: pathname, query: {...query, step: newView}}, undefined, { shallow: true }).then();
    }
    return {
        handleViewChange,
        boardMissionsViews,
        step
    }
}

export {useBoardMissionsNavigationButtons}