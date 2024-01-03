import {getAndSetEmployees2} from "@/services/api-service/customers/employees-api";
import {useGomakeAxios} from "@/hooks";
import {useState} from "react";
import {getWebTranslationsTable} from "@/services/api-service/aws-s3/get-web-translations-table";
import {IGetWebTranslationsTableResult} from "@/widgets/translation-widget/components/translation-table/interfaces";
import {NumberStringInput} from "@/widgets/materials-widget/components/table-cell-data/number-string-input";
import {Checkbox, IconButton} from "@mui/material";
import {TableCellData} from "@/widgets/materials-widget/components/table-cell-data/table-cell";
import {WastebasketNew} from "@/icons";


const useTranslationsTable = () => {
    const { callApi } = useGomakeAxios();
    const [translationsTableHeaders,setTranslationsTableHeaders] = useState<string[]>();
    const [translationsTableRows,setTranslationsTableRows] = useState<any>();
    const [totalPages,setTotalPages] = useState<number>();
    const [currentPage,setCurrentPage] = useState<number>(1);
    const getTranslationsTable = () =>{
        const callBack = (res) => {
            debugger;
            const data = res.data.data as IGetWebTranslationsTableResult[];
            setTotalPages(res.data.totalPages)
            if(data && data.length > 0){
                const headers = ["path","key"];
                data[0].translations.forEach(x=>{
                    headers.push(x.lang)
                })
                setTranslationsTableHeaders(headers);
               
                const rows =  data.map((dataRow) => {
                    return [
                        dataRow.path,dataRow.key,
                        ...dataRow.translations.map(header => (
                            <textarea value={header.translation}/>
                        )),
                    ];
                })
                setTranslationsTableRows(rows)
            }
            
        };
        getWebTranslationsTable(callApi, callBack, {page:currentPage});
    }
    return{
        getTranslationsTable,
        totalPages,
        translationsTableHeaders,
        translationsTableRows,
        currentPage,
        setCurrentPage
    }
}
export { useTranslationsTable };