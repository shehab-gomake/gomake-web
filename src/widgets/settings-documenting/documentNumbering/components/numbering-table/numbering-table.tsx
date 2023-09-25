import {useTranslation} from "react-i18next";
import { PrimaryTable } from "@/components/tables/primary-table";
const NumberingTable = () => {
    const {t} = useTranslation();
    const tableHeaders = [
        t('documentingSettings.name'),
        t('documentingSettings.prefix'),
        t('documentingSettings.value'),
        t('documentingSettings.details'),
        t('documentingSettings.more'),
    ];

    return (
        <>
        <PrimaryTable stickyFirstCol={false} stickyHeader={false} rows={null} headers={tableHeaders}></PrimaryTable>
        </>
    );
}

export {NumberingTable}