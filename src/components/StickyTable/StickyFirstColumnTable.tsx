import { TableContainer, TableHead, TableRow,Table, TableCell, TableBody, makeStyles, Skeleton } from "@mui/material";
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
    <TableContainer style={{width:"100%"}}>
        <Table
     
        aria-label="simple table"
        style={clasess.table}
        >
        {columns && (
            <div style={clasess.header}>
            {columns?.map((header: any, index: number) => 
                
                index == 0 ? (<div style={clasess.sticky}>{header.text}</div>) :  (<div style={clasess.headerItem}>{header.text}{header.icon}</div>)
            )}
            </div>
      )}

        <div style={clasess.tableBody}>
        {_tableRows?.length > 0 ? (
          <>
            {_tableRows?.map((row: any, index: number) => {
                debugger
                return (
                <Row
                    key={`body_row${index}`}
                    index={index}
                    row={row}
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

