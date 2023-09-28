import Stack from "@mui/material/Stack";
import {IconButton} from "@mui/material";
import {EditPencilIcon} from "@/components/icons/edit-pencil-icon";
import {useTranslation} from "react-i18next";

interface ITableHeaderProps {
    headerTitle: string;
    roleId: string;
    onClickUpdate: (id: string) => void;
}

const TableHeader = ({headerTitle, roleId, onClickUpdate}: ITableHeaderProps) => {
    const {t} = useTranslation();
    return (
        <Stack direction={'column'} gap={'10px'} alignItems={'center'} >
            <span style={{minWidth: 'fit-content'}}>{t(headerTitle)}</span>
            {
                !!roleId && <IconButton onClick={()=>onClickUpdate(roleId)}>
                    <EditPencilIcon height={20} width={20}/>
                </IconButton>
            }
        </Stack>
    )
}

export {TableHeader}