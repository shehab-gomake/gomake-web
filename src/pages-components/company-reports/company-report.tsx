import { PrimaryTable } from "@/components/tables/primary-table";
import { useCompanyReport } from "./use-comany-report";

const CompanyReportWidget = () => {
    const {AllReport , tableHeaders , t} = useCompanyReport();
   
    return(
        <>
        <div style={{margin:20}}>   
            <PrimaryTable
                stickyFirstCol={false}
                stickyHeader={true}
                maxHeight={650}
                rows={AllReport}
                headers={tableHeaders}
                />

        </div>
        </>
    )

};


export { CompanyReportWidget };
