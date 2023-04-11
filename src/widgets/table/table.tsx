import { useEffect, useState } from "react";

import { Header } from "./components";
import { IProps } from "./interfaces";
import { Row } from "./components";
import { useStyle } from "./style";
import { Skeleton } from "@mui/material";

const Table = ({ tableHeaders, tableRows }: IProps) => {
  const [_tableRows, setTableRows] = useState(tableRows);
  const { clasess } = useStyle();
  useEffect(() => {
    setTableRows(tableRows);
  }, [tableRows]);
  return (
    <div style={clasess.container}>
      <div style={clasess.header}>
        {tableHeaders.map((header: string, index: number) => {
          return (
            <Header
              key={`header_item${index}`}
              header={header}
              index={index}
              width={`${100 / tableHeaders.length}%`}
            />
          );
        })}
      </div>
      <div style={clasess.tableBody}>
        {_tableRows?.length > 0 ? (
          <>
            {_tableRows?.map((row: any, index: number) => {
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
        )}
      </div>
    </div>
  );
};
export { Table };
