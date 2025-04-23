import { GoMakeModal, GomakeTextInput } from "@/components";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { useMissionsStationsModal } from "./use-mission-stations-modal";
import { IActionMachines } from "@/widgets/production-floor/state/actions-list";
import { CollapseOptionComponent } from "@/widgets/production-floor/filters/select/actions-select/collapse-option-component";
import { useStyle } from "./style";
import { FormGroup, Stack } from "@mui/material";
import { PrimaryButton } from "@/components/button/primary-button";

interface IModalFilters {
  openModal: boolean;
  onClickCloseModal: () => void;
  actions: IActionMachines[];
  onClickApply: any;
}

const ScrollableDiv = styled.div`
  max-height: 35vh;
  overflow-y: auto;
  overflow-x: auto;
  padding: 0 16px;
  background-color: #fff;

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

const MissionsStationsModal = ({
  onClickApply,
  openModal,
  onClickCloseModal,
  actions,
}: IModalFilters) => {
  const { classes } = useStyle();
  const { t } = useTranslation();
  const {
    stations,
    openCollapse,
    scrollRef,
    onSelectStation,
    onSelectMachine,
    toggleCollapse,
    getList,
    filter,
    handleFilterChange,
    resetToInitial,
    commitCurrentSelection,
  } = useMissionsStationsModal({
    actions,
  });

  return (
    <GoMakeModal
      openModal={openModal}
      onClose={() => {
        onClickCloseModal();
      }}
      insideStyle={classes.modalContainer}
      modalTitle={t("usersSettings.manageStations")}
    >
      <FormGroup sx={{ gap: "10px", paddingY: "10px" }}>
        <div style={classes.listContainer}>
          <GomakeTextInput
            sx={classes.searchFiledStyle}
            placeholder={t("productionFloor.search")}
            value={filter}
            onChange={handleFilterChange}
          />
        </div>
        <ScrollableDiv ref={scrollRef}>
          {getList().map((option, index) => {
            return (
              <CollapseOptionComponent
                isFilter={!!filter}
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
      </FormGroup>
      <div style={classes.buttonContainer}>
        <PrimaryButton
          variant="contained"
          style={{ height: "40px" }}
          onClick={() => {
            onClickApply(stations);
            commitCurrentSelection();
            onClickCloseModal();
          }}
        >
          {t("productionFloor.apply")}
        </PrimaryButton>

        <PrimaryButton
          variant="outlined"
          onClick={() => {
            resetToInitial();
            onClickCloseModal();
          }}
          style={{ height: "40px" }}
        >
          {t("sales.quote.cancel")}
        </PrimaryButton>
      </div>
    </GoMakeModal>
  );
};

export { MissionsStationsModal };
