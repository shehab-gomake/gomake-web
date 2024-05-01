import {KanbanCardComponent} from "@/widgets/production-floor/kanban-view/kanban-card/kanban-card-component";
import {useDrop} from "react-dnd";
import {IBoardMissions} from "@/widgets/production-floor/interfaces/board-missions";
import {Stack} from "@mui/material";
import {IProductionStatus} from "@/widgets/production-floor/interfaces/production-floor-status";
import {useProductionFloorData} from "@/widgets/production-floor/use-production-floor-data";

interface IProps {
    status: IProductionStatus;
    count: number;
    boardsMissions: IBoardMissions[]
}

function KanbanColumnComponent({status, boardsMissions, count}: IProps) {
    const {updateStatus} = useProductionFloorData();
    const [{isOver}, drop] = useDrop(() => ({
        accept: 'task',
        drop: (item: IBoardMissions, monitor) => {
            const didDrop = monitor.didDrop();
            if (didDrop) {
                return;
            }
            updateStatus([{BoardMissionId:item.id,productType:item.productType}], status.id).then();
        },
        collect: monitor => ({
            isOver: !!monitor.isOver(),
            canDrop: !!monitor.canDrop(),
        }),
    }), [status, boardsMissions]);
    return (
        <Stack ref={drop}
               gap={'10px'}
               minHeight={'100%'}
               width={'100%'}
               borderRadius={'16px'}
             style={{margin: '0 10px', padding: '10px', backgroundColor: 'rgba(0, 0, 0, 0.08)', opacity: isOver ? 0.6 : 1, overflow: 'hidden'}}>
            <h2 style={{
                height: '80px',
                width: '100%',
                minHeight: '80px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: status.backgroundColor,
                color: status.textColor,
                borderRadius: '16px 16px 0 0',
            }}>{`${status.name} (${count})`}</h2>
            <Stack overflow={'auto'} gap={'10px'}>
                {boardsMissions.map((board) => (
                    <KanbanCardComponent key={board.id} board={board}/>
                ))}
            </Stack>
        </Stack>
    );
}

export {KanbanColumnComponent};