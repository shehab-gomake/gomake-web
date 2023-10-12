import { useState } from "react";
import { useGomakeAxios, useSnackBar } from "@/hooks";
import {getSpreadSheetColumnsApi} from "@/services/api-service/materials/materials-spreadsheets-view-api";
import {Matrix,CellBase} from "react-spreadsheet";

interface IRow{
    
}
const useMaterialsSpreadSheetsView = () => {
    const [columns, setColumn] = useState<string[]>([]);
    const [data, setData] = useState<Matrix<CellBase>>([
        [{ value: "" }], [{ value: "" }], [{ value: "" }],
    ]);
    const { callApi } = useGomakeAxios();
    const getSpreadSheetColumns = async (materialType:string) => {
        const callBack = (res) => {
            if (res.success) {
                setColumn(res.data);
            }
        };
        await getSpreadSheetColumnsApi(callApi, callBack,{materialType});
    };
    const setSpreadSheetData = async (matrix:Matrix<CellBase>) => {
        
        var lastRow = matrix[matrix.length-1]
        console.log(lastRow)
        if(lastRow.find(x=> x && x.value)){
            matrix.push([{value:""}])
        }
        var ff = JSON.parse(JSON.stringify(matrix))
        setData(ff)
    }
    return {
        columns,
        data,
        setSpreadSheetData,
        getSpreadSheetColumns
    };
};

export { useMaterialsSpreadSheetsView };
