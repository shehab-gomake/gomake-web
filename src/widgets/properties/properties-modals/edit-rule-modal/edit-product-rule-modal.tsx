import {useTranslation} from "react-i18next";
import {GoMakeModal, GomakePrimaryButton} from "@/components";

import {useStyle} from "./style";
import {useEffect, useState} from "react";
import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd";
import {RuleMappingWidget} from "./rule-mapping";
import {useGomakeAxios, useSnackBar} from "@/hooks";
import {
    deleteProductProfitRuleApi,
    getProductProfitRulesApi,
    orderProductProfitRuleApi
} from "@/services/api-service/products/product-endpoints";

const EditProductProfitRulesModal = ({
                                         openModal,
                                         onClose,
                                         onOpenAddRuleModal,
                                         productId
                                     }) => {
    const {t} = useTranslation();
    const {clasess} = useStyle();
    const [rules, setRules] = useState<any[]>([]);
    const {callApi} = useGomakeAxios();
    const {alertFaultUpdate, alertSuccessUpdate, alertSuccessDelete, alertFaultDelete} = useSnackBar();
    useEffect(() => {
        setRules([])
        if (!!productId) {
            getProductProfitRules(productId).then();
        }
    }, [productId]);

    const getProductProfitRules = async (productId) => {
        const callBack = res => {
            if (res.success) {
                setRules(res.data?.map(rule => ({
                    ...rule,
                    successEvent: rule?.profitsModel === 0 ? 'Action' : 'Product'
                })));
            }
        }
        await getProductProfitRulesApi(callApi, callBack, productId);
    }
    const deleteRule = async (ruleId: string) => {
        const callBack = res => {
            if (res?.success) {
                alertSuccessDelete();
                setRules(rules?.filter(rule => rule?.id !== ruleId));
            }else {
                alertFaultDelete();
            }
        }
        await deleteProductProfitRuleApi(callApi, callBack, {productId, ruleId})
    };
    const reOrderRule = async (data: any) => {
        const callBack = res => {
            if (res.success) {
                alertSuccessUpdate();
            } else {
                alertFaultUpdate();
            }
        }
        await orderProductProfitRuleApi(callApi, callBack, {productId, newRulesArray: data});
    };

    const onDragEnd = (result) => {
        if (!result.destination) {
            return;
        }
        const items = Array.from(rules);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        const transformedArray = items.map((item: any, index: number) => ({
            id: item?.id,
            priority: index + 1,
        }));
        setRules(items);
        reOrderRule(transformedArray);
    };
    const getItemStyle = (isDragging, draggableStyle) => ({
        ...draggableStyle,
        position: "relative",
        top: 0,
        left: 0,
    });
    return (
        <>
            <GoMakeModal
                openModal={openModal}
                modalTitle={t("properties.editRules")}
                onClose={() => {
                    onClose();
                }}
                insideStyle={clasess.insideStyle}
            >
                <div style={clasess.mainContainer}>
                    <div style={clasess.rulesContainer}>
                        <DragDropContext onDragEnd={onDragEnd}>
                            <Droppable droppableId="rules">
                                {(provided: any, snapshot: any) => (
                                    <div ref={provided.innerRef} {...provided.droppableProps}>
                                        {rules?.map((rule, index) => (
                                            <Draggable
                                                key={rule.id}
                                                draggableId={rule.id}
                                                index={index}
                                            >
                                                {(provided) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        style={getItemStyle(
                                                            snapshot.isDragging,
                                                            provided.draggableProps.style
                                                        )}
                                                    >
                                                        <RuleMappingWidget
                                                            key={`${index}-${rule.id}`}
                                                            rule={rule}
                                                            deletePropertyRule={deleteRule}
                                                        />
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </DragDropContext>
                    </div>
                    <div style={clasess.btnContainer}>
                        <GomakePrimaryButton
                            onClick={() => {
                                onClose();
                            }}
                            style={clasess.cancelBtn}
                        >
                            {t("properties.cancel")}
                        </GomakePrimaryButton>

                        <GomakePrimaryButton
                            style={clasess.sendBtn}
                            onClick={() => {
                                onOpenAddRuleModal();
                                onClose();
                            }}
                        >
                            {t("properties.addRule")}
                        </GomakePrimaryButton>
                    </div>
                </div>
            </GoMakeModal>
        </>
    );
};
export {EditProductProfitRulesModal};
