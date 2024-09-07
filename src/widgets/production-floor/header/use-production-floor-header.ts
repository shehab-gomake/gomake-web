import {useRecoilState} from "recoil";
import {EProductionFloorView, productionFloorViewState} from "@/widgets/production-floor/state/production-floor-view";
import {useProductionFloorFilters} from "@/widgets/production-floor/filters/use-production-floor-filters";
import {useCallback, useMemo} from "react";
import {productionFloorPathsState} from "@/widgets/production-floor/state/production-floor-paths";
import {EPathActionType} from "@/widgets/production-floor/enums/path-action-type";
import {IProductionFloorPath} from "@/widgets/production-floor/interfaces/production-floor-path";
import {useRouter} from "next/router";

const useProductionFloorHeader = () => {
    const [view, setView] = useRecoilState(productionFloorViewState);
    const [paths] = useRecoilState(productionFloorPathsState);
    const {initGroupsFilters, hasGroupsFilters, setGroupFromPath, groups} = useProductionFloorFilters();
    const showAllJobsButton = useMemo(() => hasGroupsFilters, [hasGroupsFilters]);
    const {push, replace, query} = useRouter();
    const {groupsId} = query;

    const onClickPath = (path: IProductionFloorPath, index: number) => {
        if (path.actionType === EPathActionType.FILTER) {
            setGroupFromPath(groups.slice(0, ((index + 1)) / 2));
            push('/production-floor').then();
            setView(EProductionFloorView.TABLE);

        }
    }

    const currentPathIndex = useCallback(() => {
        if (!!groupsId) {
            return paths.map(p => p.data.groupId).indexOf(groupsId.toString());
        }
        return groups.length * 2 - 1;
    }, [paths, groupsId, groups])
    const onClickBack = () => {
        const i = currentPathIndex();
        if (i > 0) {
            const prevPath = paths[i - 1];
            if (prevPath.actionType === EPathActionType.FILTER) {
                setGroupFromPath(groups.slice(0, ((i)) / 2));
                push('/production-floor').then();
                setView(EProductionFloorView.TABLE);
            } else {
                push('/production-floor?groupsId=' + prevPath.data.groupId).then();
            }
        } else {
            initGroupsFilters().then();
            setView(EProductionFloorView.TABLE);
            navigateToProductionFloor();
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
        onClickBack,
        currentPathIndex
    }
}
export {useProductionFloorHeader}