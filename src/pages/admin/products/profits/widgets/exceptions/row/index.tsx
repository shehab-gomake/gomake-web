import { useStyle } from "./style";

const Row = ({ key, row, width }: any) => {
  const { clasess } = useStyle({ width });
  return (
    <>
      <div key={key} style={clasess.bodyRow}>
        {Object.entries(row).map((entry: [string, any], index: number) => {
          console.log(" entry[0]", entry[0]);
          return (
            <div
              key={`row_table_${index}`}
              style={
                entry[0] == "scopeOfChange"
                  ? clasess.autoComplateStyle
                  : clasess.rowItem
              }
            >
              {entry[1]}
            </div>
          );
        })}
      </div>
    </>
  );
};

export { Row };
