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
import { ChildParameteMapping } from "./child-parameter-mapping";

const ChildParameterModal = ({
  openModal,
  onClose,
  modalTitle,
  selectedParameter,
  updatedValuesConfigsForParameters,
  selectedSectonId,
  selectedSubSection,
}: any) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();

  const [state, setState] = useState({
    valuesConfigs: selectedParameter.valuesConfigs,
    childsParameters: selectedParameter.childsParameters,
  });

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
  const [items, setItems] = useState([]);
  console.log("items", items);
  const onDragEnd = (result) => {
    console.log("AAA");

    if (!result.destination) {
      return;
    }
    console.log("dragEnd");
    const updatedItems = reorder(
      items,
      result.source.index,
      result.destination.index
    );

    setItems(updatedItems);
  };
  useEffect(() => {
    if (state?.valuesConfigs?.length) {
      setItems(state.valuesConfigs);
    }
  }, [state]);
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
  return (
    <>
      <GoMakeModal
        openModal={openModal}
        modalTitle={modalTitle}
        onClose={onClose}
        insideStyle={clasess.insideStyle}
      >
        <div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-start",
              gap: 10,
              marginBottom: 15,
            }}
          >
            <div
              style={{ cursor: "pointer" }}
              onClick={() => {
                let temp = [...state.valuesConfigs];
                temp.push({
                  id: uuidv4(),
                  isHidden: false,
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
          <div style={{ height: 450, overflow: "scroll" }}>
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="droppable">
                {(provided: any, snapshot: any) => {
                  return (
                    <div ref={provided.innerRef} {...provided.droppableProps}>
                      {state?.valuesConfigs?.map((item, index) => (
                        <div key={item?.id}>
                          <ChildParameteMapping
                            item={item}
                            index={index}
                            changeItems={changeItems}
                            state={state}
                            deleteRow={deleteRow}
                          />
                        </div>
                      ))}
                      {provided.placeholder}
                    </div>
                  );
                }}
              </Droppable>
            </DragDropContext>
          </div>
          <div
            style={{
              marginTop: 50,
              display: "flex",
              justifyContent: "center",
              width: "100%",
            }}
          >
            <GomakePrimaryButton
              style={{ width: "50%", height: 40 }}
              onClick={() => {
                updatedValuesConfigsForParameters(
                  selectedSectonId,
                  selectedSubSection,
                  { ...selectedParameter, ...state }
                );
                onClose();
              }}
            >
              Add Values
            </GomakePrimaryButton>
          </div>
        </div>
      </GoMakeModal>
    </>
  );
};
export { ChildParameterModal };
