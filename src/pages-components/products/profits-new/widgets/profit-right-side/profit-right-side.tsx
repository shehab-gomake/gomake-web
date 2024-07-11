import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { useState } from "react";
import { AccordionTable } from "@/components/tables/accordion-table";
import { GoMakeDeleteModal } from "@/components";
import { AdditionsAndExceptionsMapping } from "../additions-and-exceptions-mapping";
import { PricingTableMappingMenu } from "../pricing-table-mapping-menu";
import { PricingTableMapping } from "../pricing-table-mapping";
import { ETypeException } from "../../enums/profites-enum";
import { PricingTableMenu } from "../pricing-table-menu";
import { ProfitRightSideProps } from "../../interface";
import { MinimumWidget } from "../minimum-widget";
import { AddRuleModal } from "../add-rule-modal";
import { useStyle } from "./style";
import { AdditinalProfitMenu } from "../additinal-profit-menu";
import { useTranslation } from "react-i18next";

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
    dataForDefault,
    dataForPricing,
    onDragEnd,
    deleteExceptionProfit,
    selectedPricingBy,
    actionProfitByActionId,
    getProfitsPricingTables,
    typeExceptionSelected,
    setTypeExceptionSelected,
    selectedAdditionalProfitRow,
    setSelectedActionProfitRow,
    anchorElAdditionalProfitMenu,
    openAdditionalProfitMenu,
    handleCloseAdditionalProfitMenu,
    handleClickAdditionalProfitMenu,
    ProfitCurrency,
}: ProfitRightSideProps) => {
    const { clasess } = useStyle();
    const { t } = useTranslation();
    const [openDeleteRowModal, setOpenDeleteRowModal] = useState<boolean>(false);
    const [openDeleteAdditionalRowModal, setOpenDeleteAdditionalRowModal] =
        useState<boolean>(false);
    const [openAddNewRuleModal, setOpenAddNewRuleModal] =
        useState<boolean>(false);
    const onClickOpenDeleteAdditionalRowModal = () => {
        setOpenDeleteAdditionalRowModal(true);
    };
    const onClickCloseDeleteAdditionalRowModal = () => {
        setOpenDeleteAdditionalRowModal(false);
    };
    const onClickOpenDeleteRowModal = () => {
        setOpenDeleteRowModal(true);
    };
    const onClickCloseDeleteRowModal = () => {
        setOpenDeleteRowModal(false);
    };
    const onClickOpenAddNewRuleModal = () => {
        setOpenAddNewRuleModal(true);
    };
    const onClickCloseAddNewRuleModal = () => {
        setOpenAddNewRuleModal(false);
    };

    return (
        <div style={clasess.mainHeaderContainer}>
            <AccordionTable
                title={t("products.profits.pricingListWidget.pricingTables")}
                isDefault={true}
                onclickOpenMenu={(e) => {
                    handleClickPricingTables(e),
                        setTypeExceptionSelected(ETypeException.NEWBASE);
                }}
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
                                                            handleClickPricingTablesMapping={
                                                                handleClickPricingTablesMapping
                                                            }
                                                            setSelectedPricingTableItems={
                                                                setSelectedPricingTableItems
                                                            }
                                                            selectedPricingTableItems={
                                                                selectedPricingTableItems
                                                            }
                                                        />
                                                    </div>
                                                )}
                                            </Draggable>
                                        ) : (
                                            <div key={item.id}>
                                                <PricingTableMapping
                                                    item={item}
                                                    handleClickPricingTablesMapping={
                                                        handleClickPricingTablesMapping
                                                    }
                                                    setSelectedPricingTableItems={
                                                        setSelectedPricingTableItems
                                                    }
                                                    selectedPricingTableItems={selectedPricingTableItems}
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
                {dataForDefault?.map((item) => {
                    return (
                        <div key={item.id} style={{ width: "100%" }}>
                            <PricingTableMapping
                                item={item}
                                handleClickPricingTablesMapping={
                                    handleClickPricingTablesMapping
                                }
                                setSelectedPricingTableItems={setSelectedPricingTableItems}
                                selectedPricingTableItems={selectedPricingTableItems}
                            />
                        </div>
                    );
                })}
            </AccordionTable>
            <div data-tour={'profitStep3'} style={{ width: '100%' }}>
                <AccordionTable
                    title={t("products.profits.pricingListWidget.additionsAndExceptions")}
                    onclickOpenMenu={(e) => {
                        handleClickPricingTables(e),
                            setTypeExceptionSelected(ETypeException.ADDITIONAL);
                    }}
                >
                    {dataForExceptions?.map((item) => {
                        return (
                            <div key={item.id} style={{ width: "100%" }}>
                                <AdditionsAndExceptionsMapping
                                    item={item}
                                    handleClickPricingTablesMapping={
                                        handleClickAdditionalProfitMenu
                                    }
                                    selectedAdditionalProfitRow={selectedAdditionalProfitRow}
                                    setSelectedActionProfitRow={setSelectedActionProfitRow}
                                    ProfitCurrency={ProfitCurrency}
                                />
                            </div>
                        );
                    })}
                </AccordionTable>
            </div>
            <div data-tour={'profitStep4'} style={{ width: '100%' }}>
                <MinimumWidget
                    minimumValue={minimumValue}
                    isUpdateMinimumValue={isUpdateMinimumValue}
                    onBlurMinimumValue={onBlurMinimumValue}
                    setIsUpdateMinimumValue={setIsUpdateMinimumValue}
                    onInputChangeMinimumValue={onInputChangeMinimumValue}
                />
            </div>
            <PricingTableMenu
                handleClose={handleClosePricingTables}
                open={openPricingTables}
                anchorEl={anchorElPricingTables}
                onClickOpenAddNewRuleModal={onClickOpenAddNewRuleModal}
            />
            <PricingTableMappingMenu
                handleClose={handleClosePricingTablesMapping}
                open={openPricingTablesMapping}
                anchorEl={anchorElPricingTablesMapping}
                selectedPricingTableItems={selectedPricingTableItems}
                onClickOpenDeleteRowModal={onClickOpenDeleteRowModal}
                onClickOpenAddNewRuleModal={onClickOpenAddNewRuleModal}
                setTypeExceptionSelected={setTypeExceptionSelected}
            />
            <AdditinalProfitMenu
                handleClose={handleCloseAdditionalProfitMenu}
                open={openAdditionalProfitMenu}
                anchorEl={anchorElAdditionalProfitMenu}
                onClickOpenDeleteAdditionalRowModal={
                    onClickOpenDeleteAdditionalRowModal
                }
            />
            <GoMakeDeleteModal
                openModal={openDeleteRowModal}
                onClose={onClickCloseDeleteRowModal}
                onClickDelete={() =>
                    deleteExceptionProfit(selectedPricingTableItems?.id)
                }
            />
            <GoMakeDeleteModal
                openModal={openDeleteAdditionalRowModal}
                onClose={onClickCloseDeleteAdditionalRowModal}
                onClickDelete={() =>
                    deleteExceptionProfit(selectedAdditionalProfitRow?.id)
                }
            />
            <AddRuleModal
                openModal={openAddNewRuleModal}
                onCloseModal={onClickCloseAddNewRuleModal}
                typeExceptionSelected={typeExceptionSelected}
                selectedPricingBy={selectedPricingBy}
                actionProfitByActionId={actionProfitByActionId}
                getProfitsPricingTables={getProfitsPricingTables}
                selectedPricingTableItems={selectedPricingTableItems}
            />
        </div>
    );
};
export { ProfitRightSideWidget };
