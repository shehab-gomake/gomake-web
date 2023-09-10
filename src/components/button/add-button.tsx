import Button from "@mui/material/Button";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import {useStyle} from "@/components/button/style";

interface IProps {
    label: string;
    onClick: () => void;
}
const AddButton = ({label, onClick}: IProps) => {
    const {classes} = useStyle()
    return(
        <Button
            sx={classes.addBtn}
            startIcon={<AddBoxOutlinedIcon />}
            variant={"contained"}
            onClick={onClick}
        >
            {label}
        </Button>
    );
}

export {AddButton}