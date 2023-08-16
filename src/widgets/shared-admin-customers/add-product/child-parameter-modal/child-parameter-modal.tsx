import { useTranslation } from "react-i18next";
import { GoMakeModal, GomakeTextInput } from "@/components";

import { useStyle } from "./style";
import { PlusIcon } from "@/icons";
import { DeleteIcon } from "@/components/icons/delete-icon";
import { useEffect, useState } from "react";

const ChildParameterModal = ({
  openModal,
  onClose,
  modalTitle,
  selectedParameter,
  selectedSectonId,
  selectedSubSection,
}: any) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();

  const [values, setValues] = useState<any>([]);
  const changeItems = (index: number, filedName: string, value: any) => {
    let temp = [...values];
    temp[index] = {
      ...temp[index],
      [filedName]: value,
    };
    setValues(temp);
  };

  useEffect(() => {
    setValues(selectedParameter);
  }, [selectedParameter]);

  console.log("values", values);
  const [inputValues, setInputValues] = useState<any>([]);
  useEffect(() => {
    setInputValues(selectedParameter?.valuesConfigs);
  }, [selectedParameter]);
  const handleUpdateNameChange = (index, newValue) => {
    const updatedInputValues: any = [...inputValues];
    updatedInputValues[index].updateName = newValue;
    setInputValues(updatedInputValues);
  };

  const handleValueChange = (configIndex, valueId, newValue) => {
    const updatedInputValues: any = [...inputValues];
    updatedInputValues[configIndex].values[valueId] = newValue;
    setInputValues(updatedInputValues);
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
          <div style={clasess.addNewValueContainer}>
            <div style={clasess.textInputContainer}>
              <GomakeTextInput
                style={clasess.textInputStyle}
                placeholder="Enter Value"
              />
            </div>

            {values?.childsParameters?.map((value: any, index: number) => {
              return (
                <div style={clasess.textInputContainer} key={`child_${index}`}>
                  <GomakeTextInput
                    style={clasess.textInputStyle}
                    placeholder={`Enter ${value?.name}`}
                  />
                </div>
              );
            })}
            <div style={{ cursor: "pointer" }}>
              <PlusIcon width={25} height={25} />
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            {values?.valuesConfigs?.map((value: any, index: number) => {
              return (
                <div style={clasess.addNewValueContainer}>
                  <div style={clasess.textInputContainer}>
                    <GomakeTextInput
                      style={clasess.textInputStyle}
                      placeholder="Enter Value"
                      defaultValue={value?.updateName}
                      onChange={(e) =>
                        handleUpdateNameChange(index, e.target.value)
                      }
                    />
                  </div>
                  {Object.keys(value.values).map((valueId) => {
                    return (
                      <div style={clasess.textInputContainer} key={valueId}>
                        <GomakeTextInput
                          style={clasess.textInputStyle}
                          placeholder="Enter Value"
                          defaultValue={value.values[valueId]}
                          onChange={(e) =>
                            handleValueChange(index, valueId, e.target.value)
                          }
                        />
                      </div>
                    );
                  })}
                  <div style={{ cursor: "pointer" }}>
                    <DeleteIcon color="red" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </GoMakeModal>
    </>
  );
};
export { ChildParameterModal };
