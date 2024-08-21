import { PrimaryTable } from "@/components/tables/primary-table";
import { useMessageTemplate } from "../../../useMessageTemplate";
import { useEffect } from "react";
import { useRecoilValue } from "recoil";
import { allSmsTemplateState } from "@/widgets/settings-mailing/states/state";

const TemplateTable = () => {

    const { tableHeaders, getSMSTemplateTypes} = useMessageTemplate();
    const allSmsTemplates = useRecoilValue<string[][]>(allSmsTemplateState)


    useEffect(() => {
        getSMSTemplateTypes();
    }, [])

    return (
        <div style={{width:"100%"}}>
        <PrimaryTable stickyFirstCol={false}  rows={allSmsTemplates} headers={tableHeaders}    maxHeight={650}
            stickyHeader={true}></PrimaryTable>
        </div>
    );
}

export { TemplateTable }