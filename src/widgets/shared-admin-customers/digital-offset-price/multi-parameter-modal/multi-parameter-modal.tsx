import { GoMakeModal, GomakePrimaryButton } from "@/components";

import { ChildrenMapping } from "./children-mapping";
import { HeaderMapping } from "./header-mapping";
import { useStyle } from "./style";
import { useMultiParameterModal } from "./use-multi-parameter-modal";

const MultiParameterModal = ({
  openModal,
  onClose,
  modalTitle,
  settingParameters,
  _renderParameterType,
  isParameterSettings = false,
  setSettingParameters
}: any) => {
  const { clasess } = useStyle();
  const { parameterLists, onClickSaveParameter, t, closeModal, onClickSaveParameterForSettings } = useMultiParameterModal({
    settingParameters,
    onClose,
    isParameterSettings
  });
  return (
    <>
      <GoMakeModal
        openModal={openModal}
        modalTitle={modalTitle}
        onClose={closeModal}
        insideStyle={clasess.insideStyle}
      >
        {
          isParameterSettings ?
            <div style={clasess.mainContainer}>
              <div style={clasess.multiSelectMainContainer}>
                {/* {_renderParameterType(
                  settingParameters?.section?.id,
                  settingParameters?.subSection?.id,
                  settingParameters?.parameter,
                  settingParameters?.subSectionParameters,
                  null,
                  settingParameters?.section,
                  settingParameters?.subSection,

                )} */}
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
                          isParameterSettings={isParameterSettings}
                          setSettingParameters={setSettingParameters}
                        />
                      );
                    })}
                  </div>
                </div>
                <GomakePrimaryButton
                  style={clasess.saveBtnContainerStyle}
                  onClick={() => { isParameterSettings ? onClickSaveParameterForSettings(settingParameters?.section?.id, settingParameters?.subSection?.id, settingParameters?.parameter) : onClickSaveParameter() }}
                >
                  {t("materials.buttons.save")}
                </GomakePrimaryButton>
              </div>
            </div>
            :
            <div style={clasess.mainContainer}>
              <div style={clasess.multiSelectMainContainer}>
                {_renderParameterType(
                  settingParameters?.parameter,
                  settingParameters?.subSection,
                  settingParameters?.section,
                  settingParameters?.parameter,
                  settingParameters?.value,
                  settingParameters?.list,
                  false,
                  false,
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
                          setSettingParameters={setSettingParameters}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
              <GomakePrimaryButton
                style={clasess.saveBtnContainerStyle}
                onClick={() => { isParameterSettings ? onClickSaveParameterForSettings(settingParameters?.section?.id, settingParameters?.subSection?.id, settingParameters?.parameter) : onClickSaveParameter() }}
              >
                {t("materials.buttons.save")}
              </GomakePrimaryButton>
            </div>
        }

      </GoMakeModal>
    </>
  );
};
export { MultiParameterModal };
