import { PrimaryTable } from "@/components/tables/primary-table";
import { useCompanyReport } from "./use-comany-report";

import { Stack } from "react-bootstrap";

const CompanyReportWidget = () => {
    const {AllReport , tableHeaders , t} = useCompanyReport();
   
    return(
        <>
        <Stack gap={20}>   
            <PrimaryTable
                stickyFirstCol={false}
                stickyHeader={true}
                maxHeight={650}
                rows={AllReport}
                headers={tableHeaders}
                />

        </Stack>
        </>
    )

};


export { CompanyReportWidget };
