import {CSSProperties, useMemo} from "react";
import {adaptRight} from "@/utils/adapter";

const useStyle = (maxHeight: number, dir: 'rtl' | 'ltr') => {
    const classes = useMemo((): Record<string, CSSProperties> => {
        return {
            tableContainer: {
                maxHeight: maxHeight ? maxHeight : '100%',
                boxSizing: 'border-box'
            },
            HeaderTable:{
                backgroundColor:"#8283BE"
            },
            HeaderCell:{
                color:"#FFFFFF",
                border:"1px solid #EAECF0 !important",
                padding:"12px 24px 12px 24px",
                gap:"12px",
                borderCollapse: "separate"         
            },
            TableRowCell:{
                height:"72px"
            }   
        };
    }, []);
    return {
        classes,
    };
};
export {useStyle};
