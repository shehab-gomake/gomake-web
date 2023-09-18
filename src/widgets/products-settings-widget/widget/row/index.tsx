import { useStyle } from "./style";

const Row = ({ row, width, tablePercent, index }: any) => {
  const { clasess } = useStyle({ width, index, tablePercent });
  return (
    <div style={clasess.bodyRow}>
      {Object.entries(row).map((entry: [string, any]) => {
        if (entry[0] !== "id" && entry[0] !== "recordID") {
          return (
            <div
              key={`row_table_${index}`}
              style={clasess.rowItem}
              className="scrollBlue"
            >
              {entry[1]}
            </div>
          );
        }
      })}
    </div>
  );
};

export { Row };
