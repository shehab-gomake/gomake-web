import {FC} from "react";
import {useGomakeTheme} from "@/hooks/use-gomake-thme";
import {Stack, Typography} from "@mui/material";
import {PrimaryButton} from "@/components/button/primary-button";
import {DeleteIcon} from "@/components/icons/delete-icon";

interface GroupHeaderProps {
    groupIndex: number;
    onRemoveGroup?: () => void;
    title: string;
    deletable?: boolean;
}

const GroupHeader: FC<GroupHeaderProps> = ({ groupIndex, onRemoveGroup, title, deletable = true }) => {
    const { secondColor } = useGomakeTheme();
    return (
        <Stack width="100%" direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" component="h5">{`${title} ${groupIndex + 1}`}</Typography>
            {deletable && (
                <PrimaryButton
                    sx={{ padding: 0, display: 'flex', alignItems: 'center' }}
                    variant="text"
                    onClick={onRemoveGroup}
                >
                    <DeleteIcon width={20} height={20} color={secondColor(500)} />
                    <span>Delete</span>
                </PrimaryButton>
            )}
        </Stack>
    );
};

export {GroupHeader}