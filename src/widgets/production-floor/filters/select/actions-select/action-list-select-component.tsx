import {
  cloneElement,
  FormEvent,
  ReactElement,
  useCallback,
  useRef,
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
import { useRouter } from "next/router";
import { useUserPermission } from "@/hooks/use-permission";
import { Permissions } from "@/components/CheckPermission/enum";

interface IProps {
  onClickApply: any;
  source: Source;
  buttonElement?: ReactElement;
  filterGroups?: any;
  setFilterGroups?: any;
}

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
                  style={{
                    width: "fit-content",
                    padding: 0,
                    gap: "5px",
                    alignItems: "center",
                    display: "flex",
                  }}
                >
                  <AccessTimeIcon
                    style={{ height: "14px", width: "14px", padding: 0 }}
                  />
                  <span
                    style={{
                      paddingTop: "2px",
                      color: "#344054",
                      fontSize: 12,
                    }}
                  >
                    {t("employeeWorkingHours.employeeHours")}
                  </span>
                </PrimaryButton>
              )}

              <FormGroup>
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
    </div>
  );
};

export { ActionsListComponent };
