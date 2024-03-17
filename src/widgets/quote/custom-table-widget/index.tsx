import { useStyle } from "./style";
import { useTranslation } from "react-i18next";
import { HeaderTable } from "./sub-widget/header";
import { RowCustomTable } from "./sub-widget/row";
import { useCustomTable } from "./use-custom-table";
import { AddNegotiateRequestModal } from "../../quote-new/modals-widgets/add-negotiate-request-modal";
import { useRecoilValue } from "recoil";
import { quoteState } from "@/pages-components/quote/store/quote";
import { RowWithChildsTable } from "./sub-widget/row/row-with-childs";
interface IProps {
  headerTitle?: string;
  tableHeaders?: any;
  headerWidth?: any;
  tableRowPercent?: any;
  data?: any;
  isCheckbox?: boolean;
}
const CustomTableWidget = ({
  headerTitle,
  tableHeaders,
  headerWidth,
  tableRowPercent,
  data,
  isCheckbox,
}: IProps) => {
  const { clasess } = useStyle({ headerWidth });
  const { t } = useTranslation();
  const { items, changeItems, changeItemsChilds, itemsChilds } = useCustomTable(
    {
      data,
    }
  );
  const quoteStateValue = useRecoilValue<any>(quoteState);

  return (
    <div style={clasess.mainContainer}>
      <div style={clasess.tableHeaderContainer}>
        <div style={clasess.headerStyle}>{headerTitle}</div>
        {/* <div style={clasess.filtersContainer}>
          <GoMakeAutoComplate
            options={["A", "B", "C", "D", "E", "F"]}
            style={clasess.autoComplateStyle}
            placeholder={t("sales.quote.sortBy")}
          />
          <GoMakeAutoComplate
            options={["A", "B", "C", "D", "E", "F"]}
            style={clasess.autoComplateStyle}
            placeholder={t("sales.quote.discountBy")}
          />
        </div> */}
      </div>
      <div style={clasess.tableHeadersStyle}>
        {tableHeaders?.map((item: string, index: number) => {
          return (
            <HeaderTable
              header={item}
              headerWidth={headerWidth}
              index={index}
            />
          );
        })}
      </div>
      <div style={clasess.row}>
        {items?.map((row: any, index: number) => {
          return (
            <>
              {row?.childsDocumentItems != null &&
                row?.childsDocumentItems.length > 0 ? (
                <div key={`body_row${index}`} style={{ width: "100%" }}>
                  <RowWithChildsTable
                    row={row}
                    tablePercent={tableRowPercent}
                    isCheckbox={isCheckbox}
                    changeItems={changeItems}
                    changeItemsChilds={changeItemsChilds}
                    indexTable={index}
                  />
                  {index != items?.length - 1 ? (
                    <div style={clasess.line} />
                  ) : null}
                </div>
              ) : (
                <div key={`body_row${index}`} style={{ width: "100%" }}>
                  <RowCustomTable
                    row={row}
                    tablePercent={tableRowPercent}
                    isCheckbox={isCheckbox}
                    changeItems={changeItems}
                    indexTable={index}
                  />
                  {index != items?.length - 1 ? (
                    <div style={clasess.line} />
                  ) : null}
                </div>
              )}
            </>
          );
        })}
      </div>
      <AddNegotiateRequestModal />
      {/* <DuplicateItemModal /> */}
      {/* <GoMakeDeleteModal
        title="Delete Item"
        yesBtn={t("materials.buttons.delete")}
        openModal={quoteStateValue.openDeleteItemModal}
        onClose={quoteStateValue.onCloseDeleteItemModal}
        subTitle="Are you sure to delete this item?"
        onClickDelete={quoteStateValue.deleteQuoteItem}
      /> */}
    </div>
  );
};

export { CustomTableWidget };
