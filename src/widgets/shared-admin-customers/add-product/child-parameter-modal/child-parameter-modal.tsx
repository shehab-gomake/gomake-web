import { useTranslation } from "react-i18next";
import {
  GoMakeModal,
  GomakePrimaryButton,
  GomakeTextInput,
} from "@/components";

import { useStyle } from "./style";
import { PlusIcon, RemoveIcon } from "@/icons";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

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
            <div
              style={{ cursor: "pointer" }}
              onClick={() => {
                let temp = [...state.valuesConfigs];
                temp.pop();
                setState({
                  ...state,
                  valuesConfigs: temp,
                });
              }}
            >
              <RemoveIcon />
            </div>
          </div>
          <div style={{ height: 150, overflow: "scroll" }}>
            {state.valuesConfigs?.map((item, index) => {
              return (
                <div
                  style={clasess.addNewValueContainer}
                  key={`parent_${index}`}
                >
                  <div style={clasess.textInputContainer}>
                    <GomakeTextInput
                      style={clasess.textInputStyle}
                      placeholder="Enter Value"
                      onChange={(e) =>
                        changeItems(index, "updateName", e.target.value)
                      }
                      defaultValue={item?.updateName}
                    />
                  </div>

                  {state?.childsParameters?.map(
                    (value: any, indexChild: number) => {
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
                            defaultValue={
                              state.valuesConfigs[index].values[value?.id]
                            }
                          />
                        </div>
                      );
                    }
                  )}
                </div>
              );
            })}
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
