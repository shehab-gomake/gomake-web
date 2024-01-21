import { useTranslation } from "react-i18next";
import {
    GoMakeModal,
    GomakePrimaryButton,
    GomakeTextInput,
} from "@/components";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useStyle } from "./style";
import { RemoveIcon } from "@/icons";
import { useEffect, useState } from "react";
import { useClientType } from "./use-client-type";

const ClientTypeModal = ({
    openModal,
    onClose,
    modalTitle,
    clientTypeId,
    selectedParameter,
}: any) => {
    const { clientTypeName, setClientTypeName, addClientType, deleteClientType, clientTypesCategories } = useClientType(clientTypeId);
    const { t } = useTranslation();
    const { classes } = useStyle();
    const [state, setState] = useState({
        valuesConfigs: clientTypesCategories,
    });

    useEffect(() => {
        if (selectedParameter?.valuesConfigs) {
            setState({
                valuesConfigs: [...selectedParameter?.valuesConfigs],
            });
        }
    }, [selectedParameter]);

  
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
                        <div>
                            <DragDropContext onDragEnd={null}>
                                <Droppable droppableId="droppable">
                                    {(provided: any, snapshot: any) => {
                                        return (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.droppableProps}
                                                style={{width:"100%"}}
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
                                                                style={classes.optionStyle}
                                                            >
                                                                <div style={classes.textInputContainer} >
                                                                    <GomakeTextInput
                                                                        style={classes.textInputStyle}
                                                                        placeholder="Enter Name"
                                                                        defaultValue={item?.label}
                                                                        disabled={true}
                                                                    />
                                                                </div>
                                                                <div
                                                                    style={{ cursor: "pointer" }}
                                                                    onClick={() => deleteClientType(item?.id)}
                                                                >
                                                                    <RemoveIcon />
                                                                </div>
                                                            </div>
                                                        )}

                                                    </Draggable>
                                                ))}
                                                <div style={classes.textInputContainer}>
                                                    <GomakeTextInput
                                                        style={classes.textInputStyle}
                                                        placeholder="Enter Name"
                                                        onChange={(e) => setClientTypeName(e.target.value)}
                                                    />
                                                </div>
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
                        <GomakePrimaryButton
                            style={{ width: "50%", height: 40 }}
                            onClick={() => {
                                addClientType(clientTypeName);
                                onClose();
                            }}
                        >{t("addValues")}</GomakePrimaryButton>
                    </div>
                </div>
            </GoMakeModal>
        </>
    );
};
export { ClientTypeModal };