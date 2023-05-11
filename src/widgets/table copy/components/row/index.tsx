import { useStyle } from "./style";

const Row = ({ index, row, width }: any) => {
  const { clasess } = useStyle({ width });
  return (
    <>
      <div style={clasess.bodyRow}>
        {Object.entries(row).map((entry: [string, any], index: number) => {
          return (
            <div key={`row_table_${index}`} style={clasess.rowItem}>
              {entry[1]}
            </div>
          );
        })}
      </div>
    </>
  );
};

export { Row };
