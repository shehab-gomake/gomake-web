import {
    useBoardMissionsNavigationButtons
} from "@/widgets/production-floor/views/board-missions-view/navigation-buttons/use-navigationButtons";
import Stack from "@mui/material/Stack";
import {ToggleButton, ToggleButtonGroup} from "@mui/material";
import {styled} from "@mui/material/styles";
import {useGomakeTheme} from "@/hooks/use-gomake-thme";

const NavigationButtonsComponent = () => {
    const {handleViewChange, step, boardMissionsViews} = useBoardMissionsNavigationButtons()
    return (
        <Stack>
            <ToggleButtonGroup value={step}
                               exclusive
                               onChange={handleViewChange}>
                {
                    boardMissionsViews.map(view => <PrimaryToggleButton value={view.value}>
                        {view.labelKey}
                    </PrimaryToggleButton>)
                }
            </ToggleButtonGroup>
        </Stack>
    )
}


const PrimaryToggleButton = styled(ToggleButton)(() => {
    const {primaryColor} = useGomakeTheme()
    return {
        color: primaryColor(500),
        backgroundColor: 'white',
        '&:hover': {
            color: "white",
            backgroundColor: primaryColor(500)
        },
        "&.Mui-selected, &.Mui-selected:hover": {
            color: "white",
            backgroundColor: primaryColor(500)
        }
    }
});
export {NavigationButtonsComponent}