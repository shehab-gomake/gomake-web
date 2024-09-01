import {useRecoilState} from "recoil";
import {EProductionFloorView, productionFloorViewState} from "@/widgets/production-floor/state/production-floor-view";
import {useProductionFloorFilters} from "@/widgets/production-floor/filters/use-production-floor-filters";
import {useMemo} from "react";
import {productionFloorPathsState} from "@/widgets/production-floor/state/production-floor-paths";
import {EPathActionType} from "@/widgets/production-floor/enums/path-action-type";
import {IProductionFloorPath} from "@/widgets/production-floor/interfaces/production-floor-path";
import {useRouter} from "next/router";

const useProductionFloorHeader = () => {
    const [view, setView] = useRecoilState(productionFloorViewState);
    const [paths, setPaths] = useRecoilState(productionFloorPathsState);
    const {initGroupsFilters, hasGroupsFilters, setGroupFromPath, groups} = useProductionFloorFilters();
    const showAllJobsButton = useMemo(() => hasGroupsFilters, [hasGroupsFilters]);
    const {push, replace} = useRouter();


    const onClickPath = (path: IProductionFloorPath, index: number) => {
        if (path.actionType === EPathActionType.FILTER) {
            setGroupFromPath(groups.slice(0, ((index + 1)) / 2));
            push('/production-floor').then();
            setView(EProductionFloorView.TABLE);

        }
    }

    const onClickBack = () => {
        const tempPaths = [...paths];
        tempPaths.pop();
        const lastPath = paths[tempPaths.length - 1];
        if (!lastPath) {
            initGroupsFilters().then();
            setView(EProductionFloorView.TABLE);
            navigateToProductionFloor()
        } else {
            if (lastPath.actionType === EPathActionType.URL) {
                push('/production-floor?groupsId=' + lastPath.data.groupId);
            } else {
                push('/production-floor').then();
                setView(EProductionFloorView.TABLE);
                setGroupFromPath(groups.slice(0, paths.length/ 2));

            }
        }
    }
    const navigateToProductionFloor = () => {
        replace('/production-floor', undefined, {shallow: true});
    }
    return {
        view,
        setView,
        initGroupsFilters,
        hasGroupsFilters,
        showAllJobsButton,
        paths,
        onClickPath,
        navigateToProductionFloor,
        push,
        onClickBack
    }
}
export {useProductionFloorHeader}