import {
    useBoardMissionsNavigationButtons
} from "@/widgets/production-floor/views/board-missions-view/navigation-buttons/use-navigationButtons";
import Stack from "@mui/material/Stack";
import { Skeleton, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import {
    MoreActionsButton
} from "@/widgets/production-floor/views/board-missions-view/navigation-buttons/more-actions-button";
import {
    DocumentsButton
} from "@/widgets/production-floor/views/board-missions-view/navigation-buttons/documents-button";
import { useTranslation } from "react-i18next";
import { Permissions } from "@/components/CheckPermission/enum";
import { PermissionCheck } from "@/components/CheckPermission/check-permission";
import { useRecoilState } from "recoil";
import { boardMissionsDetailsState } from "@/widgets/production-floor/state/boards";
import {
    ApprovalFileStatusComponent
} from "@/widgets/production-floor/table-view/status-table/table-row/approval-file-status-component";

const NavigationButtonsComponent = () => {
    const { handleViewChange, step, boardMissionsViews } = useBoardMissionsNavigationButtons();
    const [boardMissionsDetails] = useRecoilState(boardMissionsDetailsState);
    const isLoading = !boardMissionsDetails?.boardMissionId;

    const { t } = useTranslation();
    return (
        <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
            {isLoading ? (
                // Skeleton for the Toggle Button Group
                <Stack direction="row" gap="10px">
                    <Skeleton variant="rectangular" width={240} height={42} style={{ borderRadius: 16 }} />
                </Stack>
            ) : (
                <PrimaryToggleButtonGroup value={step} exclusive onChange={handleViewChange}>
                    {boardMissionsViews.map((view) => (
                        <PrimaryToggleButton value={view.value} key={view.value}>
                            {t(view.labelKey)}
                        </PrimaryToggleButton>
                    ))}
                </PrimaryToggleButtonGroup>
            )}

            {isLoading ? (
                // Skeletons for the Action Buttons (DocumentsButton and MoreActionsButton)
                <Stack direction={'row'} alignItems={'center'} gap={'12px'}>
                    <Skeleton variant="rectangular" width={200} height={40} style={{ borderRadius: 12 }} />
                    <Skeleton variant="rectangular" width={50} height={40} style={{ borderRadius: 12 }} />

                </Stack>
            ) : (
                <Stack direction={'row'} alignItems={'center'} gap={'12px'}>
                    <ApprovalFileStatusComponent height={'40px'} width={'50px'} fileStatus={boardMissionsDetails.showGraphicsApprovalAlert}/>
                    <DocumentsButton />
                    <PermissionCheck userPermission={Permissions.EDIT_BOARD_MISSION_IN_PRODUCTION_FLOOR}>
                        <MoreActionsButton />
                    </PermissionCheck>
                </Stack>
            )}
        </Stack>
    );
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
    const { primaryColor } = useGomakeTheme()
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

export { NavigationButtonsComponent }