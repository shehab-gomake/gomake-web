import Stack from "@mui/material/Stack";
import {IconButton} from "@mui/material";
import {EditPencilIcon} from "@/components/icons/edit-pencil-icon";

interface ITableHeaderProps {
    headerTitle: string;
    roleId: string;
    onClickUpdate: (id: string) => void;
}

const TableHeader = ({headerTitle, roleId, onClickUpdate}: ITableHeaderProps) => {
    return (
        <Stack direction={'column'} gap={'10px'} alignItems={'center'} >
            <span style={{minWidth: 'fit-content'}}>{headerTitle}</span>
            {
                !!roleId && <IconButton onClick={()=>onClickUpdate(roleId)}>
                    <EditPencilIcon height={20} width={20}/>
                </IconButton>
            }
        </Stack>
    )
}

export {TableHeader}