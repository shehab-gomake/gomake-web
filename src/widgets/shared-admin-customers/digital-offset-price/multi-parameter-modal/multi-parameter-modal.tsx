import { GoMakeModal, GomakePrimaryButton } from "@/components";

import { ChildrenMapping } from "./children-mapping";
import { HeaderMapping } from "./header-mapping";
import { useStyle } from "./style";
import { useEffect, useState } from "react";

const MultiParameterModal = ({
  openModal,
  onClose,
  modalTitle,
  settingParameters,
  _renderParameterType,
  selectedValueConfig,
}) => {
  const { clasess } = useStyle();
  const parameterLists = settingParameters?.parameter?.settingParameters;

  console.log("selectedValueConfig", selectedValueConfig);

  return (
    <>
      <GoMakeModal
        openModal={openModal}
        modalTitle={modalTitle}
        onClose={onClose}
        insideStyle={clasess.insideStyle}
        withClose={false}
      >
        <div style={clasess.mainContainer}>
          <div style={clasess.multiSelectMainContainer}>
            {_renderParameterType(
              settingParameters?.parameter,
              settingParameters?.subSection,
              settingParameters?.section,
              settingParameters?.parameter,
              settingParameters?.value,
              settingParameters?.list,
              false
            )}
          </div>
          <div style={clasess.tableContainer}>
            <div style={clasess.headerTableContainer}>
              {parameterLists?.map((item, index: number) => {
                return (
                  <HeaderMapping
                    key={`header_${index}`}
                    item={item}
                    index={index}
                  />
                );
              })}
            </div>
            <div style={clasess.childernTableContainer}>
              <div style={clasess.childernTableRowContainer}>
                {parameterLists?.map((item, index: number) => {
                  return (
                    <ChildrenMapping
                      key={`child_${index}`}
                      parameters={parameterLists}
                      item={item}
                      index={index}
                      clasess={clasess}
                      settingParameters={settingParameters}
                    />
                  );
                })}
              </div>
            </div>
          </div>
          <GomakePrimaryButton style={clasess.saveBtnContainerStyle}>
            Save
          </GomakePrimaryButton>
        </div>
      </GoMakeModal>
    </>
  );
};
export { MultiParameterModal };
