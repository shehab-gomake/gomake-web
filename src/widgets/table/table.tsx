import { useStyle } from "./style";
import { Row } from "./components";
import { Header } from "./components";
import { IProps } from "./interfaces";

const Table = ({ tableHeaders, tableRows }: IProps) => {
  const { clasess } = useStyle();
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
        {tableRows?.map((row: any, index: number) => {
          return (
            <Row
              key={`body_row${index}`}
              index={index}
              row={row}
              width={`${100 / Object.entries(row).length}%`}
            />
          );
        })}
      </div>
    </div>
  );
};
export { Table };
