const RowInside = ({ index, tablePercent, clasess, entry, row }: any) => {
  return (
    <div
      key={`row_table_${index}`}
      style={{ ...clasess.rowItem, width: `${tablePercent[index]}` }}
    >
      <div key={`row_table_${index}`} style={clasess.rowItem}>
        {entry[1]}
      </div>
    </div>
  );
};

export { RowInside };
