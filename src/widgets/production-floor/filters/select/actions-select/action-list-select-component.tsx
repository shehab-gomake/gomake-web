import {
  cloneElement,
  FormEvent,
  ReactElement,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { Button, Divider, FormGroup, IconButton, Paper } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { GomakeTextInput } from "@/components";
import {
  Source,
  useActionsList,
} from "@/widgets/production-floor/filters/select/actions-select/use-actions-list";
import { SecondaryButton } from "@/components/button/secondary-button";
import { IStation } from "@/widgets/production-floor/interfaces/filters";
import { ClickOutside } from "@/components/click-out-side/click-out-side";
import { CollapseOptionComponent } from "@/widgets/production-floor/filters/select/actions-select/collapse-option-component";
import ClearIcon from "@mui/icons-material/Clear";
import { useStyle } from "./style";
import { DepartmentModal } from "@/widgets/production-floor/header/components/groups/department-modal";
import { SaveIcon } from "@/widgets/production-floor/header/components/icons/save-icon";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";

interface IProps {
  onClickApply: (v: IStation[]) => void;
  source: Source;
  buttonElement?: ReactElement;
}

const ActionsListComponent = ({
  onClickApply,
  source,
  buttonElement,
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
    filterGroups,
    selectedGroupId,
    setSelectedGroupId,
    handleSelectGroup,
    getStationFilterGroups,
    deleteStationFilterGroupById,
    createBoardMissionStationFilterGroup,
  } = useActionsList({ source, onClickApply });

  const { classes } = useStyle({ source });
  const { secondColor } = useGomakeTheme();
  const buttonRef = useRef<HTMLButtonElement>(null);

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

  useEffect(() => {
    getStationFilterGroups();
  }, []);

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
        <ClickOutside exceptionRef={buttonRef} onClick={() => setOpen(false)}>
          <Paper sx={classes.paperStyle}>
            <div style={{ minWidth: "280px" }}>
              <FormGroup>
                <div style={classes.listContainer}>
                  <GomakeTextInput
                    sx={classes.searchFiledStyle}
                    placeholder={t("productionFloor.search")}
                    value={filter}
                    onChange={handleFilterChange}
                  />
                </div>
                <div style={classes.optionsDiv}>
                  {getList().map((option, index) => {
                    return (
                      <CollapseOptionComponent
                        isFilter={!!filter}
                        key={index + option.actionId + option.actionName}
                        onSelectStation={onSelectStation}
                        onSelectMachine={onSelectMachine}
                        {...option}
                      />
                    );
                  })}
                </div>
              </FormGroup>
              <div style={classes.applyBtnContainer}>
                <SecondaryButton
                  style={classes.applyBtnStyle}
                  variant={"contained"}
                  onClick={() => {
                    setOpen(false);
                    onClickApply(actionsMachinesIds);
                    setSelectedGroupId(null);
                  }}
                >
                  {t("productionFloor.apply")}
                </SecondaryButton>
                {source === Source.PRODUCTION_FLOOR && (
                  <div onClick={handleClickSave} style={classes.iconContainer}>
                    <SaveIcon color={secondColor(500)} />
                  </div>
                )}
              </div>
            </div>

            {filterGroups?.length !== 0 &&
              source === Source.PRODUCTION_FLOOR && (
                <>
                  <Divider orientation="vertical" flexItem />
                  <div style={classes.departmentsContainer}>
                    <span style={classes.departmentsLabel}>
                      {t("productionFloor.departmentName")}
                    </span>
                    <div
                      style={{
                        ...classes.departmentsContainer,
                        maxHeight: "320px",
                        overflow: "scroll",
                        gap: "8px",
                      }}
                    >
                      {filterGroups?.map((group) => (
                        <div
                          key={group?.id}
                          onClick={() => handleSelectGroup(group?.id)}
                          style={{
                            ...classes.departmentTicket,
                            backgroundColor:
                              selectedGroupId === group?.id
                                ? "#FFDFF2"
                                : "white",
                            border:
                              selectedGroupId === group?.id
                                ? "1px solid #ED028C"
                                : "1px solid #ccc",
                          }}
                        >
                          <span style={classes.departmentText}>
                            {group?.name}
                          </span>
                          <IconButton
                            onClick={(event) => {
                              event.stopPropagation();
                              deleteStationFilterGroupById(group?.id);
                            }}
                          >
                            <ClearIcon
                              style={{
                                ...classes.clearIconStyle,
                                color:
                                  selectedGroupId === group?.id
                                    ? "black"
                                    : "#98A2B3",
                              }}
                            />
                          </IconButton>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
          </Paper>
        </ClickOutside>
      )}
      <DepartmentModal
        ref={buttonRef}
        openModal={openDepartmentModal}
        onClose={onClickCloseDepartmentModal}
        onClickAdd={createBoardMissionStationFilterGroup}
      />
    </div>
  );
};

export { ActionsListComponent };
