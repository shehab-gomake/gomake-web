import React from 'react';
import { FONT_FAMILY } from "@/utils/font-family";
import { useDynamicTableStyle } from './style-table';
import { useTranslation } from 'react-i18next';

const DynamicTable = ({ data }) => {
  const { classes } = useDynamicTableStyle();
  const { t } = useTranslation();
  // Helper function to render cell values with proper formatting
  const renderCellValues = (values) => {
    if (!values || values.length === 0) return null;

    return values.map((valueObj, index) => {
      const { value, surfix, bold, color, needTranslation } = valueObj;
      const translatedValue = needTranslation ? t(`pricingWidget.dynamicTable.${value}`) : value;

      const style = {
        color: color || '#000000',
        fontWeight: bold ? 'bold' : 'normal',
        ...(bold ? FONT_FAMILY.Inter(600, 14) : FONT_FAMILY.Inter(400, 14)),
      };

      return (
        <span key={index} style={style}>
          {translatedValue}
          {surfix && surfix}
        </span>
      );
    });
  };

  // Helper function to render a single cell row
  const renderCellRow = (cellRow, rowIndex) => {
    return (
      <div key={rowIndex} style={classes.tableCellRow}>
        {renderCellValues(cellRow.values)}
      </div>
    );
  };

  // Helper function to render header cell
  const renderHeaderCell = (headerData, cellIndex) => {
    return (
      <th key={cellIndex} style={classes.tableHeaderCell}>
        {headerData.cellRows.map((cellRow, rowIndex) =>
          renderCellRow(cellRow, rowIndex)
        )}
      </th>
    );
  };

  // Helper function to render body cell
  const renderBodyCell = (cellData, cellIndex) => {
    return (
      <td key={cellIndex} style={classes.tableBodyCell}>
        {cellData.cellRows.map((cellRow, rowIndex) =>
          renderCellRow(cellRow, rowIndex)
        )}
      </td>
    );
  };

  if (!data) {
    return <div>No data available</div>;
  }

  return (
    <div style={classes.tableContainer}>
      <table style={classes.dynamicTable}>
        {/* Table Header */}
        <thead>
          <tr>
            {data.headers?.map((header, index) =>
              renderHeaderCell(header, index)
            )}
          </tr>
        </thead>

        {/* Table Body */}
        <tbody>
          {data.tableRows?.map((row, rowIndex) => {
            const rowStyle = {
              ...(rowIndex % 2 === 1 ? classes.tableEvenRow : {}),
              ...(row.bottomLineBold ? classes.tableBoldBottomRow : {}),
            };

            return (
              <tr
                key={rowIndex}
                style={rowStyle}
                onMouseEnter={(e) => {
                  Object.assign(e.currentTarget.style, classes.tableHoverRow);
                }}
                onMouseLeave={(e) => {
                  Object.assign(e.currentTarget.style, rowStyle);
                }}
              >
                {row.cells?.map((cell, cellIndex) =>
                  renderBodyCell(cell, cellIndex)
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default DynamicTable;