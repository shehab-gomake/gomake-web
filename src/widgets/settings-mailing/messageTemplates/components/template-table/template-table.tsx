import { PrimaryTable } from "@/components/tables/primary-table";
import { useMessageTemplate } from "../../../useMessageTemplate";
import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { templateGroupState } from "@/widgets/settings-mailing/states/state";
import { SMSTemplateGroup } from "../../interfaces/interface";

const TemplateTable = () => {

    const { tableHeaders, getAllSmsTemplates, allSmsTemplates} = useMessageTemplate();
    const [templateGroup, setTemplateGroup] = useRecoilState<SMSTemplateGroup>(templateGroupState);

    useEffect(() => {
        getAllSmsTemplates();
    }, [templateGroup])

    return (
        <PrimaryTable stickyFirstCol={false} stickyHeader={false} rows={allSmsTemplates} headers={tableHeaders}></PrimaryTable>
    );
}

export { TemplateTable }