import { useTranslation } from "react-i18next";

import { AccordionTable } from "@/components/tables/accordion-table";

import { useStyle } from "./style";
import { MinimumWidget } from "../minimum-widget";
import { ProfitRightSideProps } from "../../interface";
import { PricingTableMapping } from "../pricing-table-mapping";
import { PricingTableMenu } from "../pricing-table-menu";
import { PricingTableMappingMenu } from "../pricing-table-mapping-menu";
import { useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { ETypeException } from "../../enums/profites-enum";

const ProfitRightSideWidget = ({
  minimumValue,
  isUpdateMinimumValue,
  onBlurMinimumValue,
  setIsUpdateMinimumValue,
  onInputChangeMinimumValue,
  profitsPricingTables,
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
}: ProfitRightSideProps) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const [data, setData] = useState([
    {
      name: "Default",
      description: "Default",
      exceptionType: 3,
    },
    {
      name: "Default1",
      description: "Default",
      exceptionType: 2,
    },
    {
      name: "Default2",
      description: "Default",
      exceptionType: 1,
    },
    {
      name: "Default3",
      description: "Default",
      exceptionType: 0,
    },
  ]);
  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const newData = Array.from(data);
    const [removed] = newData.splice(result.source.index, 1);
    newData.splice(result.destination.index, 0, removed);
    console.log("newData", newData);
    setData(newData);
  };
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
                  {data.map((item, index) =>
                    item.exceptionType !== ETypeException.DEFAULT ? (
                      <Draggable
                        key={item.name}
                        draggableId={item.name}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <PricingTableMapping
                              key={item.name}
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
                      // Render non-draggable item for exceptionType 3
                      <div key={item.name}>
                        <PricingTableMapping
                          key={item.name}
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
        <div>children</div>
        <div>children</div>
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
