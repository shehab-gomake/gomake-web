import Button from "@mui/material/Button";
import {useStyle} from "@/widgets/admin-machines/add-machine/forms/style";

const NavigationButtons = ({onClickNext,
                               onClickBack,
                               hasBack = true,
                               hasNext = true
                           }: { onClickNext: () => void, onClickBack: () => void, hasBack: boolean, hasNext: boolean }) => {
    const {classes} = useStyle();
    return (
        <div style={classes.navigationButtons}>
            <div>
                {hasBack && <Button color={"secondary"} onClick={onClickBack}>Back</Button>}
            </div>
            <div>

                {hasNext && <Button variant={"outlined"} color={"success"} onClick={onClickNext}>Next</Button>}
            </div>
        </div>
    );
}

export {NavigationButtons};