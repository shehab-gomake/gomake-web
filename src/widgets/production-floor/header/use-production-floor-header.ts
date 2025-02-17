import { useRecoilState } from "recoil";
import {
  EProductionFloorView,
  productionFloorViewState,
} from "@/widgets/production-floor/state/production-floor-view";
import { useProductionFloorFilters } from "@/widgets/production-floor/filters/use-production-floor-filters";
import { FormEvent, useCallback, useMemo, useRef, useState } from "react";
import { productionFloorPathsState } from "@/widgets/production-floor/state/production-floor-paths";
import { EPathActionType } from "@/widgets/production-floor/enums/path-action-type";
import { useRouter } from "next/router";
import {
  Source,
  useActionsList,
} from "../filters/select/actions-select/use-actions-list";
import { IProductionFloorPath } from "../interfaces/production-floor-path";

const useProductionFloorHeader = (connectionId:string) => {
  const [view, setView] = useRecoilState(productionFloorViewState);
  const [paths] = useRecoilState(productionFloorPathsState);
  const {
    initGroupsFilters,
    hasGroupsFilters,
    setGroupFromPath,
    groups,
    onStationsChange,
  } = useProductionFloorFilters({connectionId:connectionId});

  const {
    actionsList,
    onSelectMachine,
    onSelectStation,
    actionsMachinesIds,
    open,
    setOpen,
    filter,
    setFilter,
  } = useActionsList({ source: Source.PRODUCTION_FLOOR });

  const buttonRef = useRef<HTMLButtonElement>(null);
  const showAllJobsButton = useMemo(() => hasGroupsFilters, [hasGroupsFilters]);
  const { push, replace, query } = useRouter();
  const { groupsId } = query;
  const router = useRouter();

  const onClickPath = (path: IProductionFloorPath, index: number) => {
    if (path.actionType === EPathActionType.FILTER) {
      setGroupFromPath(groups.slice(0, (index + 1) / 2));
      // push("/production-floor").then();
      push("/production-floor?view=table").then();
      setView(EProductionFloorView.TABLE);
    }
  };

  const currentPathIndex = useCallback(() => {
    if (!!groupsId) {
      return paths.map((p) => p.data.groupId).indexOf(groupsId.toString());
    }
    return groups.length * 2 - 1;
  }, [paths, groupsId, groups]);

  const onClickBack = () => {
    const i = currentPathIndex();
    if (i > 0) {
      const prevPath = paths[i - 1];
      if (prevPath.actionType === EPathActionType.FILTER) {
        setGroupFromPath(groups.slice(0, i / 2));
        // push("/production-floor").then();
        push("/production-floor?view=table").then();
        setView(EProductionFloorView.TABLE);
      } else {
        push("/production-floor?groupsId=" + prevPath.data.groupId).then();
      }
    } else {
      initGroupsFilters().then();
      setView(EProductionFloorView.TABLE);
      navigateToProductionFloor();
    }
  };

  const navigateToProductionFloor = () => {
    replace("/production-floor", undefined, { shallow: true });
  };

  const useUpdateViewInUrl = () => {
    const updateView = (view: EProductionFloorView) => {
      setView(view);

      // Update the URL with the view as a query parameter
      const viewName = EProductionFloorView[view].toLowerCase();
      router.push(`/production-floor?view=${viewName}`, undefined, {
        shallow: true,
      });
    };

    return updateView;
  };

  const handleClick = () => {
    setOpen(!open);
  };

  const handleFilterChange = (event: FormEvent<HTMLInputElement>) => {
    setFilter(event.currentTarget.value);
  };

  const getList = useCallback(() => {
    let list = [...actionsList];
    if (filter) {
      list = actionsList
        .map((action) => ({
          ...action,
          machines: action.machines.filter(
            (m) =>
              m.machineName?.toLowerCase().includes(filter.toLowerCase()) ||
              action.actionName?.toLowerCase().includes(filter.toLowerCase())
          ),
        }))
        .filter(
          (action) =>
            action.actionName.toLowerCase().includes(filter.toLowerCase()) ||
            action.machines.length > 0
        );
    }
    return list.length > 0
      ? list.sort((a, b) =>
          a.checked === b.checked ? 0 : !!a.checked ? -1 : 0
        )
      : [];
  }, [actionsList, filter]);

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
    currentPathIndex,
    onStationsChange,
    actionsMachinesIds,
    open,
    setOpen,
    filter,
    handleClick,
    handleFilterChange,
    getList,
    onSelectMachine,
    onSelectStation,
    buttonRef,
    useUpdateViewInUrl,
  };
};
export { useProductionFloorHeader };
