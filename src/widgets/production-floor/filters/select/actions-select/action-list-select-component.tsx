import {
  cloneElement,
  FormEvent,
  ReactElement,
  useCallback,
  useRef,
  useState,
  useEffect,
} from "react";
import { Button, FormGroup, Paper } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { GomakeTextInput } from "@/components";
import {
  Source,
  useActionsList,
} from "@/widgets/production-floor/filters/select/actions-select/use-actions-list";
import { SecondaryButton } from "@/components/button/secondary-button";
import { ClickOutside } from "@/components/click-out-side/click-out-side";
import { CollapseOptionComponent } from "@/widgets/production-floor/filters/select/actions-select/collapse-option-component";
import { useStyle } from "./style";
import { DepartmentModal } from "@/widgets/production-floor/header/components/groups/department-modal";
import styled from "styled-components";
import { PrimaryButton } from "@/components/button/primary-button";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import { useRouter } from "next/router";
import { useUserPermission } from "@/hooks/use-permission";
import { Permissions } from "@/components/CheckPermission/enum";
import { JobTimeAlertsModal } from "@/widgets/production-floor/header/components/job-time-alerts/job-time-alerts-modal";

interface IProps {
  onClickApply: any;
  source: Source;
  buttonElement?: ReactElement;
  filterGroups?: any;
  setFilterGroups?: any;
}

//!here aa
const ActionsListComponent = ({
  onClickApply,
  source,
  buttonElement,
  filterGroups,
  setFilterGroups,
}: IProps) => {
  const {
    t,
    actionsList,
    onSelectMachine,
    onSelectStation,
    actionsMachinesIds,
    open,
    setOpen,
    filter,
    setFilter,
    openDepartmentModal,
    onClickCloseDepartmentModal,
    handleClick,
    handleClickSave,
    createBoardMissionStationFilterGroup,
    handleCloseList,
    toggleCollapse,
    openCollapse,
    scrollRef,
  } = useActionsList({ source, onClickApply, filterGroups, setFilterGroups });
  const { push } = useRouter();
  const { classes } = useStyle({ source });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { CheckPermission } = useUserPermission();
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [openJobTimeAlertsModal, setOpenJobTimeAlertsModal] = useState(false);

  useEffect(() => {
    setIsAllSelected(actionsList.every((option) => option.checked));
  }, [actionsList]);

  const handleFilterChange = (event: FormEvent<HTMLInputElement>) => {
    setFilter(event.currentTarget.value);
  };

  const getList = useCallback(() => {
    let list = [...actionsList];
    if (filter) {
      list = actionsList
        ?.map((action) => ({
          ...action,
          machines: action.machines.filter(
            (m) =>
              m.machineName?.toLowerCase().includes(filter?.toLowerCase()) ||
              action.actionName?.toLowerCase().includes(filter?.toLowerCase())
          ),
        }))
        ?.filter(
          (action) =>
            action.actionName?.toLowerCase().includes(filter?.toLowerCase()) ||
            action.machines.length > 0
        );
    }
    return list?.length > 0
      ? list?.sort((a, b) =>
          a.checked === b.checked ? 0 : !!a.checked ? -1 : 0
        )
      : [];
  }, [actionsList, filter]);

  const handleSelectAll = () => {
    const allOptions = getList();
    const areAllSelected = allOptions.every((option) => option.checked);

    allOptions.forEach((option) => {
      if (areAllSelected) {
        onSelectStation(option.actionId, true);
        // option.machines.forEach(machine => {
        //   onSelectMachine(option.actionId, machine.machineId);
        // });
      } else {
        onSelectStation(option.actionId, false);
        // option.machines.forEach(machine => {
        //   onSelectMachine(option.actionId, machine.machineId);
        // });
      }

      // Then select/deselect all machines in that station
    });

    setIsAllSelected(!areAllSelected);
  };

  // Add effect to update isAllSelected state based on actual selection state

  const clonedChild =
    buttonElement &&
    cloneElement(buttonElement, {
      ref: buttonRef,
      onClick: handleClick,
    });

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

  return (
    <div style={{ position: "relative" }}>
      {!!buttonElement ? (
        clonedChild
      ) : (
        <Button
          ref={buttonRef}
          style={classes.buttonStyle}
          variant={"outlined"}
          onClick={handleClick}
        >
          <span>{t("productionFloor.selectStations")}</span>
          <KeyboardArrowDownIcon />
        </Button>
      )}
      {open && (
        <ClickOutside exceptionRef={buttonRef} onClick={handleCloseList}>
          <Paper sx={classes.paperStyle}>
            <div style={{ minWidth: "280px" }}>
              {CheckPermission(Permissions.SHOW_EMPLOYEE_WORKING_HOURS) && (
                <PrimaryButton
                  onClick={() => push("/employees-working-hours")}
                  style={classes.actionButtonStyle}
                >
                  <AccessTimeIcon style={classes.actionIconStyle} />
                  <span style={classes.actionButtonTextStyle}>
                    {t("employeeWorkingHours.employeeHours")}
                  </span>
                </PrimaryButton>
              )}
              <PrimaryButton
                onClick={() => {
                  setOpen(false);
                  setOpenJobTimeAlertsModal(true);
                }}
                style={classes.jobTimeAlertsButtonStyle}
              >
                <NotificationsActiveIcon style={classes.actionIconStyle} />
                <span style={classes.actionButtonTextStyle}>
                  {t("productionFloor.jobTimeAlerts")}
                </span>
              </PrimaryButton>

              <FormGroup>
                <div style={classes.listContainer}>
                  <GomakeTextInput
                    sx={classes.searchFiledStyle}
                    placeholder={t("productionFloor.search")}
                    value={filter}
                    onChange={handleFilterChange}
                  />
                  <SecondaryButton
                    style={{
                      marginTop: "8px",
                      width: "100%",
                      fontSize: "12px",
                      height: "32px",
                    }}
                    onClick={handleSelectAll}
                  >
                    {isAllSelected
                      ? t("productionFloor.unselectAll")
                      : t("productionFloor.selectAll")}
                  </SecondaryButton>
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
              <div style={classes.applyBtnContainer}>
                <SecondaryButton
                  style={classes.applyBtnStyle}
                  variant={"contained"}
                  onClick={() => {
                    setOpen(false);
                    source === Source.PRODUCTION_FLOOR
                      ? handleClickSave()
                      : onClickApply(actionsMachinesIds);
                  }}
                >
                  {t("productionFloor.apply")}
                </SecondaryButton>
              </div>
            </div>
          </Paper>
        </ClickOutside>
      )}
      <DepartmentModal
        openModal={openDepartmentModal}
        onClose={onClickCloseDepartmentModal}
        onClickAdd={createBoardMissionStationFilterGroup}
        onClickApply={onClickApply}
      />
      <JobTimeAlertsModal
        openModal={openJobTimeAlertsModal}
        onClose={() => setOpenJobTimeAlertsModal(false)}
      />
    </div>
  );
};

export { ActionsListComponent };
