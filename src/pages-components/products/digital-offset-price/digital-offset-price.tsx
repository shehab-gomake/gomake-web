import { useStyle } from "./style";
import { HeaderTitle } from "@/widgets";
import { useDigitalOffsetPrice } from "@/hooks";
import { GomakePrimaryButton } from "@/components";
import { TabsMappingWidget } from "./widgets/tabs-mapping";
import { AccordionMappingWidget } from "./widgets/accordion-mapping";
import { SectionMappingWidget } from "./widgets/section-mapping";
import { RightSideWidget } from "./widgets/right-side-widget";
import {
    GalleryModal,
    MakeShapeModal,
    MultiParameterModal,
} from "@/widgets/shared-admin-customers/digital-offset-price";
import { EWidgetProductType } from "./enums";
import { PricingWidget } from "@/widgets/product-pricing-widget/pricing-widget";
import { Tabs } from "@mui/material";
import { StepType } from "@reactour/tour";
import { useGoMakeTour } from "@/hooks/use-go-make-tour";

const PriceListPageWidget = ({ widgetType }) => {
    const { clasess } = useStyle();
    const {
        t,
        handleTabClick,
        handleNextClick,
        handlePreviousClick,
        onOpeneMakeShape,
        onCloseGalleryModal,
        onCloseMakeShape,
        handleChange,
        _renderParameterType,
        _getParameter,
        renderOptions,
        checkWhatRenderArray,
        navigateForRouter,
        updateQuoteItem,
        setUrgentOrder,
        setPrintingNotes,
        setGraphicNotes,
        setPriceRecovery,
        onCloseMultiParameterModal,
        duplicateSection,
        removeSection,
        duplicateParameters,
        setProductTemplate,
        multiParameterModal,
        settingParameters,
        priceRecovery,
        graphicNotes,
        printingNotes,
        urgentOrder,
        makeShapeOpen,
        GalleryModalOpen,
        activeIndex,
        productTemplate,
        tabs,
        activeTab,
        PricingTab,
        expanded,
        clientDefaultValue,
        clientTypeDefaultValue,
        clientTypesValue,
        pricingDefaultValue,
        errorMsg,
        relatedParameters,
        jobActions,
        workFlows,
        billingMethod,
        underParameterIds,
        setBillingMethod,
        samlleType,
        graphicDesigner,
        setGraphicDesigner,
        setSamlleType,
        getOutSourcingSuppliers,
        onChangeSubProductsForPrice,
        includeVAT,
        setIncludeVAT,
        isChargeForNewDie,
        setIsChargeForNewDie,
        straightKnife
    } = useDigitalOffsetPrice({ clasess, widgetType });
    const visibleSections = productTemplate?.sections?.filter(section => !section.isHidden);

    const productSteps: StepType[] = [
        {
            selector: '[data-tour="a330193f-492c-40a8-86f3-8edf5c8f0d5e"]',
            content: 'Please enter a name for the job. You can use any name you prefer, such as \'Test,\' for example.',
            position: 'bottom',
        },
        {
            selector: '[data-tour="de2bb7d5-01b1-4b2b-b0fa-81cd0445841b"]',
            content: 'Please specify the number of types (designs) required for the job. Let\'s start with one type.',
            position: 'bottom',
        },
        {
            selector: '[data-tour="4991945c-5e07-4773-8f11-2e3483b70b53"]',
            content: 'Please specify the number of types (designs) required for the job. Let\'s start with one type.',
            position: 'bottom',
        },
        {
            selector: '[data-tour="e6cb1b69-d1f9-4319-85e8-4c2ae7c3e7de"]',
            content: 'Now, please select a size for the product.',
            position: 'right',
            styles: {
                maskWrapper: (base) => ({ ...base, zIndex: 1 }),
            },
        },
        {
            selector: '[data-tour="e3f211c6-c9d2-4ba1-83b6-87d2cf3402b4"]',
            content: 'Now, please select a size for the product.',
            position: 'right',
            styles: {
                maskWrapper: (base) => ({ ...base, zIndex: 1 }),
            },
        },
        {
            selector: '[data-tour="d7b058c4-0409-43e8-b446-8f70a7027a02"]',
            content: 'Next, select the type of paper.',
            position: 'right',
            styles: {
                maskWrapper: (base) => ({ ...base, zIndex: 1 }),
            },
        },
        {
            selector: '[data-tour="c267ecb5-c774-4136-afef-3ed44c3c1f0f"]',
            content: ' Please specify the paper weight.',
            position: 'right',
            styles: {
                maskWrapper: (base) => ({ ...base, zIndex: 1 }),
            },
        },
        {
            selector: '[data-tour="12bd74c2-46eb-408a-af8f-5b221fac96c4"]',
            content: 'Please indicate the printing sides.',
            position: 'right',
            styles: {
                maskWrapper: (base) => ({ ...base, zIndex: 1 }),
            },
            action: elem => elem?.scrollIntoView({ behavior: "smooth", block: 'end' }),
        },
        {
            selector: '[data-tour="5f4b6094-1dc5-40e4-81fd-e1294fca9d10"]',
            content: 'Finally, specify the printing colors.',
            position: 'right',
            styles: {
                maskWrapper: (base) => ({ ...base, zIndex: 1 }),
            },
            action: elem => elem?.scrollIntoView({ behavior: "smooth", block: 'end' })

        },
        {
            selector: '[data-tour="product-pricing"]',
            content: 'Here you can see the recommended final price for the job.',
            position: 'bottom',
        },
        {
            selector: '[data-tour="next-button"]',
            content: 'Before moving on to the pricing details, let\'s enhance the paper. Please press "Next" to continue.',
            position: 'top',
        },
        {
            selector: '[data-tour="f80d6df9-e9be-4273-8947-34faaaded48c"]',
            content: 'Let\'s incorporate a "Lamination"!\n tab here to open the lamination section.\n',
            position: 'bottom',
        },
        {
            selector: '[data-tour="7ac619d4-196f-4610-88bb-082c1af586b8"]',
            content: 'Please select the lamination sides required.',
            position: 'right',
            styles: {
                maskWrapper: (base) => ({ ...base, zIndex: 1 }),
            },
        },
        {
            selector: '[data-tour="e499e916-09a0-44f1-add5-01e8d869ae43"]',
            content: 'And specify the lamination type.',
            position: 'right',
            styles: {
                maskWrapper: (base) => ({ ...base, zIndex: 1 }),
            },
        },
        {
            selector: '[data-tour="product-pricing"]',
            content: 'Let\'s incorporate a "Lamination"! tab here to open the lamination section',
            position: 'bottom',
        },
        {
            selector: '[data-tour="next-button"]',
            content: 'Now, let\'s discuss the business aspect and how GoMake AI calculated the price. Please press "Next" to view the analysis.',
            position: 'top',
        },
        {
            selector: '[data-tour="actions-container"]',
            content: 'Here, you can view the recommended workflow.\n' +
                'A set price is determined by summing the cost\n' +
                'of operations and multiplying it by\n' +
                'the defined profit percentage',
            position: 'top',
        },
        {
            selector: '[data-tour="allWorkflowsBtn"]',
            content: 'Here, you can view the recommended workflow.\n' +
                'A set price is determined by summing the cost\n' +
                'of operations and multiplying it by\n' +
                'the defined profit percentage',
            position: 'top',
        },
        {
            selector: '[data-tour="allWorkflowsContainer"]',
            content: 'Here, you have the option to\n' +
                'change the selected workflow to\n' +
                'any other available workflow.',
            position: 'top',
        },
        {
            selector: '[data-tour="addPricingBtn"]',
            content: 'Let\'s proceed by adding the item to the quote.\n' +
                'Please press "Add" to navigate to the cart.',
            position: 'top',
        },
    ]
    const { } = useGoMakeTour(productSteps, [relatedParameters])
    return (
        <div>
            {productTemplate?.sections?.length > 0 && (
                <div style={clasess.mainContainer}>
                    <div>
                        <HeaderTitle
                            title={productTemplate?.name}
                            marginTop={1}
                            marginBottom={24}
                        />
                    </div>
                    <div style={clasess.mainRowContainer}>
                        <div style={clasess.leftSideContainer}>
                            <div style={clasess.tabsContainer}>
                                <Tabs variant="scrollable" scrollButtons={"auto"}>
                                    {[...visibleSections, PricingTab]?.map(
                                        (item, index) => {
                                            return (
                                                <TabsMappingWidget
                                                    key={`tab-${index}`}
                                                    clasess={clasess}
                                                    index={index}
                                                    handleTabClick={handleTabClick}
                                                    activeIndex={activeIndex}
                                                    item={item}
                                                    productTemplate={productTemplate}
                                                    onDuplicateSection={duplicateSection}
                                                    onRemoveSection={removeSection}
                                                    setProductTemplate={setProductTemplate}
                                                    isAdmin={false}
                                                />
                                            );
                                        }
                                    )}
                                </Tabs>
                            </div>

                            <div style={{ height: 666, overflow: "scroll", width: "calc(100% - 330px)" }}>
                                <div style={clasess.sectionsContainer}>
                                    {[...visibleSections, PricingTab]?.map(
                                        (section: any, index: number) => {
                                            if (index === activeIndex) {
                                                if (
                                                    section.name ===
                                                    t("products.offsetPrice.admin.Pricing")
                                                ) {
                                                    return (
                                                        <PricingWidget
                                                            getOutSourcingSuppliers={getOutSourcingSuppliers}
                                                            actions={jobActions}
                                                            workFlows={workFlows}
                                                        />
                                                    );
                                                } else {
                                                    return section?.subSections
                                                        ?.filter((x) => !x.isHidden)
                                                        .map((subSection: any, index: number) => {
                                                            if (subSection?.isAccordion) {
                                                                return (
                                                                    <AccordionMappingWidget
                                                                        key={index}
                                                                        clasess={clasess}
                                                                        expanded={expanded}
                                                                        index={index}
                                                                        handleChange={handleChange}
                                                                        subSection={subSection}
                                                                        section={section}
                                                                        _renderParameterType={_renderParameterType}
                                                                        _getParameter={_getParameter}
                                                                        relatedParameters={relatedParameters}
                                                                        duplicateParameters={duplicateParameters}
                                                                        template={productTemplate}
                                                                        setTemplate={setProductTemplate}
                                                                        underParameterIds={underParameterIds}
                                                                    />
                                                                );
                                                            } else {
                                                                return (
                                                                    <SectionMappingWidget
                                                                        key={index}
                                                                        clasess={clasess}
                                                                        index={index}
                                                                        subSection={subSection}
                                                                        section={section}
                                                                        _renderParameterType={_renderParameterType}
                                                                        _getParameter={_getParameter}
                                                                        relatedParameters={relatedParameters}
                                                                        isAccordion={false}
                                                                        duplicateParameters={duplicateParameters}
                                                                        template={productTemplate}
                                                                        setTemplate={setProductTemplate}
                                                                        underParameterIds={underParameterIds}
                                                                    />
                                                                );
                                                            }
                                                        });
                                                }
                                            }
                                        }
                                    )}
                                </div>
                            </div>
                        </div>
                        <RightSideWidget
                            clasess={clasess}
                            clientDefaultValue={clientDefaultValue}
                            renderOptions={renderOptions}
                            checkWhatRenderArray={checkWhatRenderArray}
                            clientTypeDefaultValue={clientTypeDefaultValue}
                            clientTypesValue={clientTypesValue}
                            template={productTemplate}
                            tabs={tabs}
                            activeTab={activeTab}
                            onOpeneMakeShape={onOpeneMakeShape}
                            pricingDefaultValue={pricingDefaultValue}
                            setUrgentOrder={setUrgentOrder}
                            urgentOrder={urgentOrder}
                            setPrintingNotes={setPrintingNotes}
                            setGraphicNotes={setGraphicNotes}
                            graphicNotes={graphicNotes}
                            printingNotes={printingNotes}
                            widgetType={widgetType}
                            setPriceRecovery={setPriceRecovery}
                            priceRecovery={priceRecovery}
                            setSamlleType={setSamlleType}
                            includeVAT={includeVAT}
                            setIncludeVAT={setIncludeVAT}
                            setBillingMethod={setBillingMethod}
                            billingMethod={billingMethod}
                            samlleType={samlleType}
                            graphicDesigner={graphicDesigner}
                            setGraphicDesigner={setGraphicDesigner}
                            errorMsg={errorMsg}
                        />
                    </div>

                    <div
                        style={{
                            width: "100%",
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "flex-end",
                            alignItems: "center",
                            position: "fixed",
                            // paddingRight: "15px",
                            // ...adaptPaddingLeft(direction, 15),
                            bottom: 0,
                            right: 0,
                            boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.08)",
                            height: 65,
                            // zIndex: 5,
                            backgroundColor: "#FFF",
                        }}
                    >
                        <div style={{ width: "68%" }}>
                            <div style={clasess.addPreviousContainer}>
                                {activeIndex != 0 ? (
                                    <GomakePrimaryButton
                                        style={clasess.previousBtnStyle}
                                        onClick={handlePreviousClick}
                                    >
                                        {t("products.offsetPrice.admin.previousBtn")}
                                    </GomakePrimaryButton>
                                ) : null}
                                {[...productTemplate?.sections, PricingTab].length - 1 !=
                                    activeIndex ? (
                                    <div data-tour={'next-button'}>
                                        <GomakePrimaryButton
                                            style={clasess.nextBtnStyle}
                                            onClick={handleNextClick}
                                        >
                                            {t("products.offsetPrice.admin.nextBtn")}
                                        </GomakePrimaryButton>
                                    </div>
                                ) : null}
                            </div>
                        </div>
                        <div style={{ width: 220, height: 40, marginLeft: 55, marginRight: 55 }}>
                            {widgetType === EWidgetProductType.EDIT ? (
                                <GomakePrimaryButton
                                    style={clasess.addOrderBtn}
                                    onClick={updateQuoteItem}
                                >
                                    {t("materials.buttons.edit")}
                                </GomakePrimaryButton>
                            ) : (
                                <GomakePrimaryButton
                                    data-tour={'addPricingBtn'}
                                    style={clasess.addOrderBtn}
                                    onClick={navigateForRouter}
                                >
                                    {t("products.offsetPrice.admin.addOrder")}
                                </GomakePrimaryButton>
                            )}

                            {/* <div style={clasess.errorMsgStyle}>{errorMsg}</div> */}
                        </div>
                    </div>
                </div>
            )}

            <MakeShapeModal
                openModal={makeShapeOpen}
                onClose={onCloseMakeShape}
                modalTitle={t("products.offsetPrice.admin.makeShape")}
            />
            <GalleryModal
                openModal={GalleryModalOpen}
                onClose={onCloseGalleryModal}
                onChangeSubProductsForPrice={onChangeSubProductsForPrice}
                isChargeForNewDie={isChargeForNewDie}
                setIsChargeForNewDie={setIsChargeForNewDie}
                straightKnife={straightKnife}
            />
            <MultiParameterModal
                openModal={multiParameterModal}
                onClose={onCloseMultiParameterModal}
                modalTitle={""}
                settingParameters={settingParameters}
                _renderParameterType={_renderParameterType}
            />
        </div>
    );
};

export { PriceListPageWidget };
