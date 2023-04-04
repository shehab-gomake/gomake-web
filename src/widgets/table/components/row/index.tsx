import { useStyle } from "./style";

const Row = ({ index, row }: any) => {
  const { clasess } = useStyle();
  return (
    <div style={index % 2 == 0 ? clasess.bodyRow : clasess.secondRow}>
      {Object.entries(row).map((entry: [string, any], index: number) => {
        return (
          <div key={`row_table_${index}`} style={clasess.rowItem}>
            {entry[1]}
          </div>
        );
      })}
    </div>
  );
};

export { Row };
