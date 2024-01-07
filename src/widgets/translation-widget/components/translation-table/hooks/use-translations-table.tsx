import {getAndSetEmployees2} from "@/services/api-service/customers/employees-api";
import {useGomakeAxios} from "@/hooks";
import {useEffect, useState} from "react";
import {getWebTranslationsTable} from "@/services/api-service/aws-s3/get-web-translations-table";
import {
    IGetWebTranslationsTableResult,
    ITranslationResult
} from "@/widgets/translation-widget/components/translation-table/interfaces";
import { TextareaAutosize } from '@mui/base/TextareaAutosize';
import {updateWebTranslationsTable} from "@/services/api-service/aws-s3/update-web-translations-table";
import {InputUpdatedValues} from "@/widgets/quote-new/input-updated-values";


const useTranslationsTable = () => {
    const { callApi } = useGomakeAxios();
    const [translationsTableHeaders,setTranslationsTableHeaders] = useState<string[]>();
    const [translationsTableData,setTranslationsTableData] = useState<IGetWebTranslationsTableResult[]>();
    const [translationsTableRows,setTranslationsTableRows] = useState<any>();
    const [totalPages,setTotalPages] = useState<number>();
    const [currentPage,setCurrentPage] = useState<number>(1);
    const [searchFilter,setSearchFilter] = useState<string>("");
    
    const updateTranslation = (e,path,key,lang)=>{
        const value = e.target.value;
        const updateObj ={
            path:path,
            key:key,
            lang: lang,
            value:value
        }
       
        const callBack = (res) => {
            setTranslationsTableData(translationsTableData.map(x=> {
                if(x.path === path && x.key === key){
                    const translations:ITranslationResult[] = x.translations.map(y=> {
                        if(y.lang === lang){
                            return {
                                lang: y.lang,
                                translation: value,
                            }
                        }else{
                            return y;
                        }
                    })
                    const newRow:IGetWebTranslationsTableResult = {
                        path:x.path,
                        key:x.key,
                        translations:translations
                    }
                    return newRow;
                }else{
                    return x;
                }

            }));
        };
        updateWebTranslationsTable(callApi, callBack, updateObj);
    }
    useEffect(()=>{
        if(translationsTableData && translationsTableData.length > 0){
            const headers = ["path","key"];
            translationsTableData[0].translations.forEach(x=>{
                headers.push(x.lang)
            })
            setTranslationsTableHeaders(headers);

            const rows =  translationsTableData.map((dataRow) => {
                return [
                    dataRow.path,dataRow.key,
                    ...dataRow.translations.map(header => (
                        <TextareaAutosize value={header.translation} onChange={(e)=>updateTranslation(e, dataRow.path, dataRow.key,header.lang)} 
                        />
                    )),
                ];
            })
            setTranslationsTableRows(rows)
        }
    },[translationsTableData])
    const getTranslationsTable = () =>{
        const callBack = (res) => {
            const data = res.data.data as IGetWebTranslationsTableResult[];
            setTranslationsTableData(data);
            setTotalPages(res.data.totalPages)
        };
        getWebTranslationsTable(callApi, callBack, {page:currentPage,filter:searchFilter});
    }
    return{
        getTranslationsTable,
        totalPages,
        translationsTableHeaders,
        translationsTableRows,
        currentPage,
        setCurrentPage,
        searchFilter,
        setSearchFilter
    }
}
export { useTranslationsTable };