import { PrimaryTable } from "@/components/tables/primary-table";
import { useMessageTemplate } from "../../../useMessageTemplate";
import { useEffect } from "react";

const TemplateTable = () => {

    const { tableHeaders, getSMSTemplateTypes, allSmsTemplates} = useMessageTemplate();

    useEffect(() => {
        getSMSTemplateTypes();
    }, [])

    return (
        <div style={{width:"100%"}}>
        <PrimaryTable stickyFirstCol={false} stickyHeader={false} rows={allSmsTemplates} headers={tableHeaders}></PrimaryTable>
        </div>
    );
}

export { TemplateTable }