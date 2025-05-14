import { GoMakeModal, GomakePrimaryButton, GomakeTextInput } from "@/components";
import { useTranslation } from "react-i18next";
import { useStyle } from "./style";
import { CollapseOptionComponent } from "./select/actions-select/collapse-option-component";
import styled from "styled-components";
import { IActionMachines } from "../state/actions-list";
import { useEditGroupModal } from "./use-edit-group-modal";

interface IModalFilters {
  openModalEditGroup: boolean;
  onClickCloseModalEditGroup: () => void;
  handleCloseMenu: () => void;
  selectedGroupId?: any;
  actions: IActionMachines[];
  getStationFilterGroups: () => void;
  setFilters?: any;
}
const ScrollableDiv = styled.div`
    max-height: 35vh;
    overflow-y: auto;
    overflow-x: auto;
    &::-webkit-scrollbar {
      width: 8px;
    }
    &::-webkit-scrollbar-track {
      background: #f1f1f1;
    }
    &::-webkit-scrollbar-thumb {
      background: #cccdcf;
      border-radius: 10px;
    }
    &::-webkit-scrollbar-thumb:hover {
      background: #b0b0b0;
    }
    &::-webkit-scrollbar-button {
      display: none;
    }
  `;

const ModalEditGroup = ({
  openModalEditGroup,
  onClickCloseModalEditGroup,
  handleCloseMenu,
  selectedGroupId,
  actions,
  getStationFilterGroups,
  setFilters
}: IModalFilters) => {
  const { classes } = useStyle()
  const { t } = useTranslation();
  const {
    groupName,
    stations,
    openCollapse,
    scrollRef,
    handleChangeName,
    onSelectStation,
    onSelectMachine,
    toggleCollapse,
    getList,
    updateStationFilterGroup
  } = useEditGroupModal({ selectedGroupId, actions, getStationFilterGroups, setFilters });

  return (
    <GoMakeModal
      openModal={openModalEditGroup}
      onClose={() => {
        onClickCloseModalEditGroup()
        handleCloseMenu();
      }}
      insideStyle={classes.modalContainer}
      modalTitle={`Edit ${selectedGroupId?.name} Group`}
    >
      <div style={classes.modalMainContainer}>
        <div>
          <div style={classes.inputContainer}>
            <label>{t("productionFloor.name")}</label>
            <GomakeTextInput
              value={groupName}
              onChange={handleChangeName}
              style={{ width: "100%", "box-shadow": "none", "border": "1px solid #E0E0E0", "border-radius": "8px", }}
            />
          </div>
          <div>
            <ScrollableDiv ref={scrollRef}>
              {getList()?.map((option, index) => {
                return (
                  <CollapseOptionComponent
                    isFilter={false}
                    key={index + option.actionId + option.actionName}
                    onSelectStation={onSelectStation}
                    onSelectMachine={onSelectMachine}
                    open={openCollapse[option.actionId] || false}
                    onToggleCollapse={() => toggleCollapse(option.actionId)}
                    {...option}
                  />
                );
              })}
            </ScrollableDiv>
          </div>
        </div>
        <div style={classes.buttonContainer}>
          <GomakePrimaryButton style={{ height: "40px" }} onClick={() => {
            updateStationFilterGroup(stations)
            onClickCloseModalEditGroup()
            handleCloseMenu();
          }} >
            {t("navigationButtons.edit")}
          </GomakePrimaryButton>

          <GomakePrimaryButton onClick={() => {
            onClickCloseModalEditGroup()
            handleCloseMenu();
          }} style={{ height: "40px" }}> {t("sales.quote.cancel")}</GomakePrimaryButton>
        </div>
      </div>
    </GoMakeModal>
  )
};

export { ModalEditGroup }