import {useDrag} from 'react-dnd';
import {IBoardMissions} from "@/widgets/production-floor/interfaces/board-missions";
import {Stack} from "@mui/material";
import { DateFormatter} from "@/utils/adapter";
import {LabelComponent} from "@/widgets/production-floor/label-component/label-component";
import {useStyle} from "@/widgets/production-floor/kanban-view/kanban-card/style";
import { useUserPermission } from '@/hooks/use-permission';
import { Permissions } from "@/components/CheckPermission/enum";

interface IProp {
    board: IBoardMissions
}

const ItemTypes = {
    TASK: 'task',
};

const KanbanCardComponent = ({board}: IProp) => {

    const {classes} = useStyle();
    const { CheckPermission } = useUserPermission();
    const canDrag = CheckPermission(Permissions.EDIT_BOARD_MISSION_IN_PRODUCTION_FLOOR); 

    const [{ isDragging }, drag] = useDrag(() => ({
        type: ItemTypes.TASK,
        item: board,
        canDrag: canDrag,
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }), [canDrag]);


    return (
        <Stack
            direction={'column'}
            gap={'10px'}
            padding={'10px'}
            borderRadius={'12px'}
            width={'100%'}
            maxHeight={'fit-content'}
            ref={canDrag ? drag : null}
            style={{
                opacity: isDragging ? 0.8 : 1,
                backgroundColor: 'white',
                cursor: canDrag ? 'move' : 'not-allowed',
            }}
        >
            <div>
                <table style={{borderSpacing: '5px',}}>
                    <tbody>
                    <tr>
                        <td><span style={classes.jobTitle}>{board.jobName || 'Job title'}</span></td>
                        <td><LabelComponent label={board.productName}/></td>
                    </tr>
                    <tr>
                        <td><span style={classes.secondLabel}>Work order:</span></td>
                        <td><span style={classes.primaryLabel}>{board.workOrder || board.boardMissionNumber}</span></td>
                    </tr>
                    <tr>
                        <td><span style={classes.secondLabel}>Machine:</span></td>
                        <td><span
                            style={classes.primaryLabel}>{board.currentStation.machineName || board.currentStation.actionName}</span>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <Stack direction={'row'} justifyContent={'space-between'}>
                <Stack direction={'row'} gap={'2px'}>{board.automatedTags.map(tag => <span
                    style={classes.primaryLabel}>{tag}</span>)}</Stack>
                <span style={classes.primaryLabel}>{DateFormatter(board?.dueDate)}</span>
            </Stack>
        </Stack>
    );
}

export {KanbanCardComponent};