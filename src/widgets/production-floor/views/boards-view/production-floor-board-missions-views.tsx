import {useRecoilState} from "recoil";
import {EProductionFloorView, productionFloorViewState} from "@/widgets/production-floor/state/production-floor-view";
import {ProductionFloorTableView} from "@/widgets/production-floor/table-view/production-floor-table-view";
import {ProductionFloorKanbanBoard} from "@/widgets/production-floor/kanban-view/production-floor-kanban-board";
import {useProductionFloorData} from "@/widgets/production-floor/use-production-floor-data";
import {useEffect} from "react";

const ProductionFloorBoardMissionsViews = () => {
    const [view] = useRecoilState(productionFloorViewState);
    const {getData} = useProductionFloorData();
    useEffect(() => {
        getData().then();
    }, [])
    return (
      <>
          {
              view === EProductionFloorView.TABLE && <ProductionFloorTableView/>
          }
          {
              view === EProductionFloorView.KANBAN && <ProductionFloorKanbanBoard/>
          }
      </>
  )
};

export {ProductionFloorBoardMissionsViews}