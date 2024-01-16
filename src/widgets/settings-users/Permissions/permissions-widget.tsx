import { useTranslation } from "react-i18next";
import { usePermissions } from "./use-permissions";
import { SecondaryTabsComponent } from "@/components/tabs/secondary-tabs";
import { SearchInputComponent } from "@/components/form-inputs/search-input-component";
import Stack from "@mui/material/Stack";
import { PrimaryTable } from "@/components/tables/primary-table";
import { useEffect } from "react";
import { GoMakeModal } from "@/components";
import { AddUpdateRole } from "@/widgets/settings-users/Permissions/components/add-update-role";
import { EActions } from "@/widgets/settings-users/Permissions/enum/actions";


const PermissionsWidget = () => {
    const { t } = useTranslation();
    const {
        permissionsTable,
        onSelectTab,
        onChangePermissionSearch,
        getPermissionRolesRelations,
        tableHeaders,
        modalState,
        setModalState,
        setModalInputValue,
        modalInputValue,
        tabs,
        updateRoleName
    } = usePermissions();

    useEffect(() => {
        getPermissionRolesRelations().then();
    }, [])

    return (
        <Stack direction={'column'} gap={'5px'}>
            <Stack gap={"10px"}>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <SearchInputComponent onChange={onChangePermissionSearch} />
                </div>
                <SecondaryTabsComponent tabs={tabs()} onSelectTab={onSelectTab} withBackGround={false} />
            </Stack>
            <Stack display={'grid'} padding={'5px'}>
                <PrimaryTable stickyFirstCol={true} stickyHeader={true} maxHeight={550}
                    headers={tableHeaders()} rows={permissionsTable()} />
            </Stack>
            <GoMakeModal insideStyle={{ paddingLeft: 0, paddingRight: 0, width: 500, height: 250 }}
                headerPadding={20}
                openModal={modalState}
                onClose={() => setModalState(false)}
                modalTitle={t("permissionsSettings.editRole")}>
                <AddUpdateRole onActionClick={updateRoleName} action={EActions.UPDATE} value={modalInputValue}
                    onChange={(v) => {
                        setModalInputValue(v)
                    }} />
            </GoMakeModal>
        </Stack>
    )
}

export { PermissionsWidget };