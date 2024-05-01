import {MouseEvent, useMemo} from "react";
import {useRouter} from "next/router";
import {useRecoilState} from "recoil";
import {printHouseProfile} from "@/store/print-house-profile";

const useBoardMissionsNavigationButtons = () => {
    const {query, replace, pathname} = useRouter();
    const {step} = query
    const [companyProfile] = useRecoilState(printHouseProfile);
    const boardMissionsViews = useMemo(() => companyProfile.filesApiAddress ? [
            {value: 'stations', labelKey: 'stations'},
            {value: 'files', labelKey: 'files'},
            // {value: 'approval', labelKey: 'approval'},
            {value: 'activity', labelKey: 'activity'},
        ] :
        [
            {value: 'stations', labelKey: 'stations'},
            {value: 'activity', labelKey: 'activity'},], [companyProfile]);

    const handleViewChange = (e: MouseEvent<HTMLElement>, newView: string) => {
        replace({pathname: pathname, query: {...query, step: newView}}, undefined, {shallow: true}).then();
    }
    return {
        handleViewChange,
        boardMissionsViews,
        step
    }
}

export {useBoardMissionsNavigationButtons}