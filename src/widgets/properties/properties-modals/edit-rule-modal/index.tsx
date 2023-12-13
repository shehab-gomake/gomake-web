import { useTranslation } from "react-i18next";
import { GoMakeModal, GomakePrimaryButton } from "@/components";

import { useStyle } from "./style";
import { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { RuleMappingWidget } from "./rule-mapping";

const EditRulesModal = ({
  openModal,
  onClose,
  selectedProperties,
  actionId,
  onOpenAddRuleModal,
  deleteRule,
}) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const [rules, setRules] = useState<any>();

  useEffect(() => {
    setRules(selectedProperties?.actionRules);
  }, [selectedProperties]);

  const deletePropertyRule = async (ruleId: string) => {
    try {
      await deleteRule(
        selectedProperties?.propertyId,
        selectedProperties?.ruleType,
        ruleId
      );
    } catch (error) {}
  };
  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }
    const items = Array.from(rules);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setRules(items);
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
                              deletePropertyRule={deletePropertyRule}
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
export { EditRulesModal };
