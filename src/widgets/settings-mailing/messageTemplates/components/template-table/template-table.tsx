import { PrimaryTable } from "@/components/tables/primary-table";
import { useMessageTemplate } from "../../../useMessageTemplate";
import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { groupIdState } from "@/widgets/settings-mailing/states/state";


const TemplateTable = () => {

    const { tableHeaders, getAllSmsTemplates, allSmsTemplates} = useMessageTemplate();
    const [groupId, setGroupId] = useRecoilState<any>(groupIdState)

    useEffect(() => {
        getAllSmsTemplates();
    }, [groupId])

    return (
        <PrimaryTable stickyFirstCol={false} stickyHeader={false} rows={allSmsTemplates} headers={tableHeaders}></PrimaryTable>
    );
}

export { TemplateTable }