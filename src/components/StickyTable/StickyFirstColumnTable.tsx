import { TableContainer, Table, Skeleton } from "@mui/material";
import { useStyle } from "./style";
import { Header, Row } from "@/widgets/table/components";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";




const StickyFirstColumnTable = ({ data, columns }) => {
    const {clasess} = useStyle();
    const [_tableRows, setTableRows] = useState(data);
    const [istimeOut, setIsTimeOut] = useState(false);
    const { t } = useTranslation();
  

   return (
    <TableContainer style={{width:"90%",maxHeight: "900px"}}>
        <Table
     
        aria-label="simple table"
        style={clasess.table}
        >
        {
        columns && (
            <div style={clasess.header}>
            {columns?.map((header: any, index: number) => 
                
                index == 0 ? (<div style={clasess.sticky}>{header.name}</div>) :  (<div style={clasess.headerItem}>{header.name}{header.icon}</div>)
            )}
            </div>
      )}
    
        <div style={clasess.tableBody}>
         
        {data?.length > 0 ? (
          <>
            {data?.map((row: any, index: number) => {
                return (
                <Row
                    key={`body_row${index}`}
                    index={index}
                    row={row}
                    isSticky={true}
                    width={`${100 / Object.entries(row).length}%`}
                  />
                );
            })}
          </>
        ) : (
          <>
            {!istimeOut ? (
              <>
                <Skeleton
                  variant="rectangular"
                  width={"100%"}
                  height={68}
                  style={clasess.skeletonRowStyle}
                />
                <Skeleton
                  variant="rectangular"
                  width={"100%"}
                  height={68}
                  style={clasess.skeletonRowStyle}
                />
                <Skeleton
                  variant="rectangular"
                  width={"100%"}
                  height={68}
                  style={clasess.skeletonRowStyle}
                />
              </>
            ) : (
              <div style={clasess.noDataContainer}> {t("skeleton.noData")}</div>
            )}
          </>
        )}
      </div>
      
      </Table>
    </TableContainer>


   ) 
 
};

export default StickyFirstColumnTable;

