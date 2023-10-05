import { PrimaryTable } from "@/components/tables/primary-table";
import { useMessageTemplate } from "../../useMessageTemplate";
import { useEffect } from "react";

const TemplateTable = () => {

    const { tableHeaders, getAllTemplates, allTemplates } = useMessageTemplate();
    
    useEffect(() => {
        getAllTemplates();
    }, [])

    return (
        <PrimaryTable stickyFirstCol={false} stickyHeader={false} rows={allTemplates} headers={tableHeaders}></PrimaryTable>
    );
}

export { TemplateTable }