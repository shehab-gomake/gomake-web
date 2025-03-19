import { PrimaryTable } from "@/components/tables/primary-table";
import { useEffect } from "react";
import { useRecoilValue } from "recoil";
import { allSmsTemplateState } from "@/widgets/settings-mailing/states/state";
import { ApiResponse } from "@/services/api-service/interface";

interface IProps {
  getSMSTemplateTypes: () => Promise<ApiResponse>;
  tableHeaders?: string[];
}
const TemplateTable = ({ tableHeaders, getSMSTemplateTypes }: IProps) => {
  const allSmsTemplates = useRecoilValue<string[][]>(allSmsTemplateState);

  useEffect(() => {
    getSMSTemplateTypes();
  }, []);

  return (
    <div style={{ width: "100%" }}>
      <PrimaryTable
        stickyFirstCol={false}
        stickyHeader={true}
        rows={allSmsTemplates}
        headers={tableHeaders}
        maxHeight={"calc(100vh - 273px)"}
      />
    </div>
  );
};

export { TemplateTable };
