import { useTranslation } from "react-i18next";
import {
  GoMakeModal,
  GomakePrimaryButton,
  GomakeTextInput,
} from "@/components";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import { useStyle } from "./style";
import { PlusIcon, ReOrderIcon, RemoveIcon } from "@/icons";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useSnackBar } from "@/hooks";
import { PrimaryButton } from "@/components/button/primary-button";

const ExternalValuesIdModal = ({
  openModal,
  onClose,
  modalTitle,
  selectedParameter,
  updatedValuesConfigsForParameters,
  selectedSectonId,
  selectedSubSection,
}: any) => {
  const { t } = useTranslation();
  const { classes } = useStyle();
  const { setSnackbarStateValue } = useSnackBar();
  const [state, setState] = useState({
    valuesConfigs: selectedParameter.valuesConfigs,
    childsParameters: selectedParameter.childsParameters,
  });

  const isUpdateNameRepeated = (updateName, currentIndex) => {
    const formattedUpdateName = updateName.replace(/\s/g, ""); // Remove spaces from the new updateName
    return state.valuesConfigs.some(
      (item, index) =>
        item.updateName.replace(/\s/g, "") === formattedUpdateName &&
        index !== currentIndex
    );
  };

  function checkUpdateNames(array) {
    for (let item of array) {
      if (!item.updateName || item.updateName.trim() === "") {
        return false; // If any updateName is empty or only whitespace, return false
      }
    }
    return true; // If all updateNames are non-empty, return true
  }

  useEffect(() => {
    if (selectedParameter?.valuesConfigs) {
      setState({
        valuesConfigs: [...selectedParameter.valuesConfigs],
        childsParameters: selectedParameter.childsParameters,
      });
    }
  }, [selectedParameter]);

  const changeItems = (index: number, filedName: string, value: any) => {
    setState((prev) => {
      let temp = [...prev.valuesConfigs];
      temp[index] = {
        ...temp[index],
        [filedName]: value,
      };
      return {
        ...prev,
        valuesConfigs: temp,
      };
    });
  };
  const reorder = (list: any, startIndex: any, endIndex: any) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }
    const updatedItems = reorder(
      state.valuesConfigs,
      result.source.index,
      result.destination.index
    );

    setState({
      ...state,
      valuesConfigs: updatedItems,
    });
  };
  const deleteRow = (selectedRow: any) => {
    const temp = [...state?.valuesConfigs];
    const index = temp.findIndex((obj: any) => obj?.id === selectedRow?.id);
    if (index !== -1) {
      temp.splice(index, 1);
    }
    setState({
      ...state,
      valuesConfigs: temp,
    });
  };
  const getItemStyle = (isDragging, draggableStyle) => ({
    padding: 5 * 2,
    margin: `0 0 ${5}px 0`,
    mrginLeft: -100,
    userSelect: "none",
    display: "flex",
    flexDirection: "row" as "row",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
    gap: 15,
    flexWrap: "wrap" as "wrap",
    marginBottom: 25,
    backgroundColor: isDragging ? "#FAFAFA" : "",
    ...draggableStyle,
    top: 0,
    left: 0,
    position: "relative",
  });
  const getListStyle = (isDraggingOver) => ({
    width: "100%",
  });
  return (
    <>
      <GoMakeModal
        openModal={openModal}
        modalTitle={modalTitle}
        onClose={onClose}
        insideStyle={classes.insideStyle}
      >
        <div>
          <div style={{ height: 330, overflow: "scroll" }}>
            <div style={classes.addBtnStyle}>
              <div
                style={{ cursor: "pointer" }}
                onClick={() => {
                  let temp = [...state.valuesConfigs];
                  temp.push({
                    id: uuidv4(),
                    isHidden: true,
                    isDefault: false,
                    isDeleted: false,
                    updateName: "",
                    materialValueIds: [],
                    values: {},
                  });
                  setState({
                    ...state,
                    valuesConfigs: temp,
                  });
                }}
              >
                <PlusIcon width={25} height={25} />
              </div>
            </div>
            <div>
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="droppable">
                  {(provided: any, snapshot: any) => {
                    return (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        style={getListStyle(snapshot.isDraggingOver)}
                      >
                        {state?.valuesConfigs?.map((item, index) => (
                          <Draggable
                            key={item.id}
                            draggableId={item.id}
                            index={index}
                          >
                            {(provided: any, snapshot: any) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                style={getItemStyle(
                                  snapshot.isDragging,
                                  provided.draggableProps.style
                                )}
                                // style={classes.addNewValueContainer}
                              >
                                <div
                                  style={{
                                    cursor: "grab",
                                  }}
                                >
                                  <ReOrderIcon />
                                </div>

                                <div style={classes.textInputContainer}>
                                  <GomakeTextInput
                                    style={classes.textInputStyle}
                                    placeholder={t(
                                      "products.profits.exceptions.enterValue"
                                    )}
                                    onChange={(e) =>
                                      changeItems(
                                        index,
                                        "updateName",
                                        e.target.value
                                      )
                                    }
                                    defaultValue={item?.updateName}
                                    onBlur={() => {
                                      if (
                                        isUpdateNameRepeated(
                                          item?.updateName,
                                          index
                                        )
                                      ) {
                                        setSnackbarStateValue({
                                          state: true,
                                          message: t(
                                            "products.offsetPrice.admin.valueErrorMsg",
                                            { value: item.updateName }
                                          ),
                                          type: "error",
                                        });
                                      }
                                    }}
                                  />
                                </div>

                                {state?.childsParameters?.map(
                                  (value: any, indexChild: number) => {
                                    return (
                                      <div
                                        style={classes.textInputContainer}
                                        key={`child_${indexChild}`}
                                      >
                                        <GomakeTextInput
                                          style={classes.textInputStyle}
                                          placeholder={`Enter ${value?.name}`}
                                          onChange={(e) => {
                                            changeItems(index, "values", {
                                              ...state.valuesConfigs[index]
                                                .values,
                                              [value?.id]: e.target.value,
                                            });
                                          }}
                                          defaultValue={
                                            state.valuesConfigs[index].values[
                                              value?.id
                                            ]
                                          }
                                        />
                                      </div>
                                    );
                                  }
                                )}
                                <div
                                  style={{ cursor: "pointer" }}
                                  onClick={() => deleteRow(item)}
                                >
                                  <RemoveIcon />
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    );
                  }}
                </Droppable>
              </DragDropContext>
            </div>
          </div>

          <div
            style={{
              marginTop: 10,
              display: "flex",
              justifyContent: "center",
              width: "100%",
            }}
          >
            <PrimaryButton variant="contained" onClick={() => alert("update")}>
              Update
            </PrimaryButton>
          </div>
        </div>
      </GoMakeModal>
    </>
  );
};
export { ExternalValuesIdModal };
