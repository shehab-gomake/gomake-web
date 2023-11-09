import Button from "@mui/material/Button";
import {useStyle} from "@/components/button/style";
import { AddIcon } from '@/components/icons/icons';

interface IProps {
    label: string;
    onClick: () => void;
}
const AddNewButton = ({label, onClick}: IProps) => {
    const {classes} = useStyle()
    return(
        <Button
            sx={classes.addNewBtn}
            startIcon={<AddIcon />}
            variant={"text"}
            onClick={onClick}
        >
            {label}
        </Button>
    );
}

export {AddNewButton}