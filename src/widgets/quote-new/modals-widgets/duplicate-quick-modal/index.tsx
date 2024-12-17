import { useTranslation } from "react-i18next";
import { GoMakeAutoComplate, GoMakeModal, GomakeTextInput } from "@/components";

import { useStyle } from "./style";
import { useState } from "react";
import { DeleteModalIcon } from "./icons/delete-icon";
import { AddModalIcon } from "./icons/add-icon";
import { Divider } from "@mui/material";
import { DuplicateModalIcon } from "./icons/duplicate-icon";

const DuplicateQuickModal = ({
  openModal,
  onClose,
}) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const [groups, setGroups] = useState<any>([{ id: 1, parameters: [{ name: "", value: "" }] }]);
  console.log("groups", groups)
  const addGroup = () => {
    const newGroup = {
      id: groups.length + 1,
      parameters: [{ name: "", value: "" }]
    };
    setGroups([...groups, newGroup]);
  };

  const addParameter = (groupIndex) => {
    const newGroups = [...groups];
    newGroups[groupIndex].parameters.push({ name: "", value: "" });
    setGroups(newGroups);
  };
  const deleteParameter = (groupIndex, paramIndex) => { // Step 2: Add delete function
    const newGroups = [...groups];
    newGroups[groupIndex].parameters.splice(paramIndex, 1);
    setGroups(newGroups);
  };
  const deleteGroup = (groupIndex) => {
    const newGroups = groups.filter((_, index) => index !== groupIndex);
    // Reassign ids based on the new index
    const reorderedGroups = newGroups.map((group, index) => ({
      ...group,
      id: index + 1,
    }));
    setGroups(reorderedGroups);
  };

  return (
    <>
      <GoMakeModal
        openModal={openModal}
        modalTitle={t("properties.parameter")}
        onClose={onClose}
        insideStyle={clasess.insideStyle}
      >
        <div style={clasess.mainContainer}>
          {groups.map((group, groupIndex) => (
            <div key={group.id} style={{ width: "100%" }}>
              <div style={clasess.groupContainer}>
                <div>
                  <div style={clasess.groupTitle}>{`Group ${group.id}`}</div>
                </div>
                <div style={clasess.groupActions}>
                  <div onClick={addGroup} style={clasess.groupAction}>
                    <DuplicateModalIcon />
                  </div>
                  {groups.length > 1 && (
                    <div onClick={() => deleteGroup(groupIndex)} style={clasess.groupAction}>
                      <DeleteModalIcon />
                    </div>
                  )}
                </div>
              </div>
              {group.parameters.map((param, index) => (
                <div key={index} style={clasess.groupParameter}>
                  <div style={clasess.groupParameterDropdown}>
                    <div>Parameter</div>
                    <GoMakeAutoComplate
                      options={[
                        { label: "Job Name", value: "jobName" },
                        { label: "Quantity", value: "quantity" },
                        { label: "Width", value: "width" },
                        { label: "Length", value: "length" },
                      ]}
                      style={clasess.groupParameterInput}
                      placeholder="Select parameter"
                      withArrow={true}
                    />
                  </div>
                  <div style={clasess.groupParameterDropdown}>
                    <div>Value</div>
                    <GomakeTextInput
                      style={clasess.groupParameterInput}
                      placeholder="Enter the value"
                    />
                  </div>
                  <div style={clasess.groupParameterAddContainer}>
                    <div onClick={() => addParameter(groupIndex)} style={clasess.groupParameterAdd}>
                      <AddModalIcon />
                    </div>
                    {group.parameters.length > 1 && (
                      <div onClick={() => deleteParameter(groupIndex, index)} style={clasess.groupParameterAdd}>
                        <DeleteModalIcon width="40" height="40" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {group.id !== groups.length && <Divider style={{ marginTop: 24, }} />}
            </div>
          ))}
        </div>
      </GoMakeModal>
    </>
  );
};
export { DuplicateQuickModal };
