import { GomakeTextInput } from "@/components";
import { Draggable } from "react-beautiful-dnd";

import { useStyle } from "./style";
import { ReOrderIcon, RemoveIcon } from "@/icons";

const ChildParameteMapping = ({
  item,
  index,
  changeItems,
  state,
  deleteRow,
}: any) => {
  const { clasess } = useStyle();

  return (
    <Draggable draggableId={item.id} index={index}>
      {(provided: any, snapshot: any) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={clasess.addNewValueContainer}
        >
          <div
            style={{
              cursor: "grab",
            }}
            {...provided.dragHandleProps}
          >
            <ReOrderIcon />
          </div>

          <div style={clasess.textInputContainer}>
            <GomakeTextInput
              style={clasess.textInputStyle}
              placeholder="Enter Value"
              onChange={(e) => changeItems(index, "updateName", e.target.value)}
              defaultValue={item?.updateName}
            />
          </div>

          {state?.childsParameters?.map((value: any, indexChild: number) => {
            return (
              <div
                style={clasess.textInputContainer}
                key={`child_${indexChild}`}
              >
                <GomakeTextInput
                  style={clasess.textInputStyle}
                  placeholder={`Enter ${value?.name}`}
                  onChange={(e) => {
                    changeItems(index, "values", {
                      ...state.valuesConfigs[index].values,
                      [value?.id]: e.target.value,
                    });
                  }}
                  defaultValue={state.valuesConfigs[index].values[value?.id]}
                />
              </div>
            );
          })}
          <div style={{ cursor: "pointer" }} onClick={() => deleteRow(item)}>
            <RemoveIcon />
          </div>
        </div>
      )}
    </Draggable>
  );
};
export { ChildParameteMapping };
