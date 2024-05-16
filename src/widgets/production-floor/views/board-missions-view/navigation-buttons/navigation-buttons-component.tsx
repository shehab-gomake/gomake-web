import {
    useBoardMissionsNavigationButtons
} from "@/widgets/production-floor/views/board-missions-view/navigation-buttons/use-navigationButtons";
import Stack from "@mui/material/Stack";
import {ToggleButton, ToggleButtonGroup} from "@mui/material";
import {styled} from "@mui/material/styles";
import {useGomakeTheme} from "@/hooks/use-gomake-thme";
import {
    MoreActionsButton
} from "@/widgets/production-floor/views/board-missions-view/navigation-buttons/more-actions-button";
import {
    DocumentsButton
} from "@/widgets/production-floor/views/board-missions-view/navigation-buttons/documents-button";

const NavigationButtonsComponent = () => {
    const {handleViewChange, step, boardMissionsViews} = useBoardMissionsNavigationButtons()
    return (
        <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
            <PrimaryToggleButtonGroup value={step}
                                      exclusive
                                      onChange={handleViewChange}>
                {
                    boardMissionsViews.map(view => <PrimaryToggleButton value={view.value}>
                        {view.labelKey}
                    </PrimaryToggleButton>)
                }
            </PrimaryToggleButtonGroup>
            <Stack direction={'row'} alignItems={'center'} gap={'12px'}>
                {/*<DocumentsButton/>*/}
                <MoreActionsButton/>
            </Stack>
        </Stack>
    )
}

const PrimaryToggleButtonGroup = styled(ToggleButtonGroup)(() => {
    return {
        borderRadius: '16px',
        border: '1px solid #D0D5DD',
        overflow: 'hidden',
        width: 'fit-content'
    }
})

const PrimaryToggleButton = styled(ToggleButton)(() => {
    const {primaryColor} = useGomakeTheme()
    return {
        color: primaryColor(500),
        backgroundColor: 'white',
        height: '40px',
        border: 0,
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