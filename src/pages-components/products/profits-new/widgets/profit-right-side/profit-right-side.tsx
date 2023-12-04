import { useTranslation } from "react-i18next";

import { AccordionTable } from "@/components/tables/accordion-table";

import { useStyle } from "./style";
import { MinimumWidget } from "../minimum-widget";
import { ProfitRightSideProps } from "../../interface";
import { PricingTableMapping } from "../pricing-table-mapping";
import { PricingTableMenu } from "../pricing-table-menu";
import { PricingTableMappingMenu } from "../pricing-table-mapping-menu";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { ETypeException } from "../../enums/profites-enum";
import { AdditionsAndExceptionsMapping } from "../additions-and-exceptions-mapping";

const ProfitRightSideWidget = ({
  minimumValue,
  isUpdateMinimumValue,
  onBlurMinimumValue,
  setIsUpdateMinimumValue,
  onInputChangeMinimumValue,
  anchorElPricingTables,
  openPricingTables,
  handleClickPricingTables,
  handleClosePricingTables,
  anchorElPricingTablesMapping,
  openPricingTablesMapping,
  handleClickPricingTablesMapping,
  handleClosePricingTablesMapping,
  selectedPricingTableItems,
  setSelectedPricingTableItems,
  dataForExceptions,
  dataForPricing,
  onDragEnd,
}: ProfitRightSideProps) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();

  return (
    <div style={clasess.mainHeaderContainer}>
      <AccordionTable
        title="Pricing Tables"
        isDefault={true}
        onclickOpenMenu={handleClickPricingTables}
      >
        <div style={{ width: "100%" }}>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {dataForPricing?.map((item, index) =>
                    item.exceptionType !== ETypeException.DEFAULT ? (
                      <Draggable
                        key={item.id}
                        draggableId={item.id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <PricingTableMapping
                              key={item.id}
                              item={item}
                              index={index}
                              handleClickPricingTablesMapping={
                                handleClickPricingTablesMapping
                              }
                              setSelectedPricingTableItems={
                                setSelectedPricingTableItems
                              }
                            />
                          </div>
                        )}
                      </Draggable>
                    ) : (
                      <div key={item.id}>
                        <PricingTableMapping
                          item={item}
                          index={index}
                          handleClickPricingTablesMapping={
                            handleClickPricingTablesMapping
                          }
                          setSelectedPricingTableItems={
                            setSelectedPricingTableItems
                          }
                        />
                      </div>
                    )
                  )}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </AccordionTable>
      <AccordionTable
        title="Additions and Exceptions"
        onclickOpenMenu={handleClickPricingTables}
      >
        {dataForExceptions?.map((item, index) => {
          return (
            <div key={item.id} style={{ width: "100%" }}>
              <AdditionsAndExceptionsMapping
                item={item}
                handleClickPricingTablesMapping={
                  handleClickPricingTablesMapping
                }
                setSelectedPricingTableItems={setSelectedPricingTableItems}
              />
            </div>
          );
        })}
      </AccordionTable>
      <MinimumWidget
        minimumValue={minimumValue}
        isUpdateMinimumValue={isUpdateMinimumValue}
        onBlurMinimumValue={onBlurMinimumValue}
        setIsUpdateMinimumValue={setIsUpdateMinimumValue}
        onInputChangeMinimumValue={onInputChangeMinimumValue}
      />
      <PricingTableMenu
        handleClose={handleClosePricingTables}
        open={openPricingTables}
        anchorEl={anchorElPricingTables}
      />
      <PricingTableMappingMenu
        handleClose={handleClosePricingTablesMapping}
        open={openPricingTablesMapping}
        anchorEl={anchorElPricingTablesMapping}
        selectedPricingTableItems={selectedPricingTableItems}
      />
    </div>
  );
};
export { ProfitRightSideWidget };
