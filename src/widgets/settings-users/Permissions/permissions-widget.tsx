import {HeaderTitle} from "@/widgets/header-title";
import {useTranslation} from "react-i18next";
import {useSettings} from "./use-settings";
import {SecondaryTabsComponent} from "@/components/tabs/secondary-tabs";
import {SearchInputComponent} from "@/components/form-inputs/search-input-component";
import Stack from "@mui/material/Stack";
import {PrimaryTable} from "@/components/tables/primary-table";


const PermissionsWidget = () => {
    const {t} = useTranslation();

    const {tableHeaders, groups, table, onSelectTab, onChangePermissionSearch, PermissionName} =
        useSettings();
    const tabs = [];
    const headers = [];
    tableHeaders?.forEach((row) => {
        headers.push({name: row.name})
    })
    groups?.forEach((row) => {
        tabs.push({title: row.name, selectedTab: onSelectTab});
    });

    return (
        <Stack direction={'column'} gap={'10px'}>
            <HeaderTitle title={t("permissionsSettings.title")} marginBottom={3}/>
            <SecondaryTabsComponent tabs={tabs} onSelectTab={onSelectTab}/>
            <div style={{display: 'flex', justifyContent: 'flex-end'}}>
                <SearchInputComponent onChange={onChangePermissionSearch} value={PermissionName}/>
            </div>
            <Stack display={'grid'} padding={'5px'} maxHeight={'800px'}>
                <PrimaryTable stickyFirstCol={true} stickyHeader={true} maxHeight={600}
                                    headers={tableHeaders.map(head => head.name)} rows={table}/>
            </Stack>
        </Stack>
    )
}

export {PermissionsWidget};