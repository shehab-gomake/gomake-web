import {
    useTranslationsTable
} from "@/widgets/translation-widget/components/translation-table/hooks/use-translations-table";
import {useEffect} from "react";
import {PrimaryTable} from "@/components/tables/primary-table";
import Pagination from "@mui/material/Pagination";
import {SearchInputComponent} from "@/components/form-inputs/search-input-component";
import {ETranslationSource} from "@/widgets/translation-widget/enums";

interface ITranslationTableProps{
    translationSource:ETranslationSource;
}
const TranslationTable = (props:ITranslationTableProps) =>{
    const {
        getTranslationsTable,
        translationsTableHeaders,
        translationsTableRows,totalPages, 
        currentPage, 
        setCurrentPage,
        setSearchFilter,
        searchFilter
    } = useTranslationsTable(props.translationSource);
    useEffect(()=>{
        getTranslationsTable()
    },[currentPage,searchFilter])
    return(
        <div>
            <SearchInputComponent onChange={(e) => setSearchFilter(e)} />
            <div style={{marginTop:15}}>
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
        </div>
    )
}
export { TranslationTable };