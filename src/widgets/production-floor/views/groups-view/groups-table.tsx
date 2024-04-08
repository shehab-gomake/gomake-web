import {useProductionFloorGroups} from "@/widgets/production-floor/views/groups-view/use-production-floor-groups";
import {SecondaryTable} from "@/components/tables/secondary-table";
import {IconButton} from "@mui/material";
import ArrowCircleRightOutlinedIcon from '@mui/icons-material/ArrowCircleRightOutlined';
const GroupsTable = () => {
    const {groups, onNavigateToGroupBoardsMissions} = useProductionFloorGroups();
    return (
        groups.length > 0 && <SecondaryTable rows={
          groups.map(group => [group.groupName, group.clients,
              <div>{group.machines}</div>, ...group.boardMissionStatuses.map(status => <span style={{color: status.boardMissionStatus.textColor}}>{status.count}</span>),
            <IconButton onClick={() => onNavigateToGroupBoardsMissions(group.value, group.valueId)}><ArrowCircleRightOutlinedIcon/></IconButton>]
          )}
                                             headers={['rule', 'clients', 'machines', ...groups[0].boardMissionStatuses.map(s => <span style={{color: s.boardMissionStatus.textColor}}>{s.boardMissionStatus.name}</span>), 'go']}/>
    )
}

export {GroupsTable}