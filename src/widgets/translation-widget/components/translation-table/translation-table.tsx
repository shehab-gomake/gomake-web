import {
    useTranslationsTable
} from "@/widgets/translation-widget/components/translation-table/hooks/use-translations-table";
import {useEffect} from "react";
import {PrimaryTable} from "@/components/tables/primary-table";
import Pagination from "@mui/material/Pagination";


const TranslationTable = () =>{
    const {getTranslationsTable,translationsTableHeaders,translationsTableRows,totalPages, currentPage, setCurrentPage} = useTranslationsTable();
    useEffect(()=>{
        debugger;
        getTranslationsTable()
    },[currentPage])
    return(
        <div>
            <PrimaryTable
                stickyFirstCol={false}
                stickyHeader={false}
                rows={translationsTableRows}
                headers={translationsTableHeaders}
            ></PrimaryTable>
            <div style={{ marginBottom: "5px" }}>
                <Pagination
                    count={totalPages}
                    variant="outlined"
                    color="primary"
                    page={currentPage}
                    onChange={(event, value) => setCurrentPage(value)}
                />
            </div>
        </div>
    )
}
export { TranslationTable };