import {
  cloneElement,
  FormEvent,
  ReactElement,
  useCallback,
  useEffect,
  useRef,
  useState,
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
import { SaveSelectionModal } from "@/widgets/production-floor/header/components/groups/save-selection-modal";
import { DepartmentModal } from "@/widgets/production-floor/header/components/groups/department-modal";

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
    openSelectionModal,
    onClickOpenSelectionModal,
    onClickCloseSelectionModal,
    openDepartmentModal,
    onClickOpenDepartmentModal,
    onClickCloseDepartmentModal,

    //!New
    filterGroups,
    getStationFilterGroups,
    getStationFilterGroupById,
    deleteStationFilterGroupById,
    createBoardMissionStationFilterGroup,
  } = useActionsList({ source, onClickApply });

  const { classes } = useStyle({ source });

  const handleClick = () => {
    setOpen(!open);
  };

  const handleFilterChange = (event: FormEvent<HTMLInputElement>) => {
    setFilter(event.currentTarget.value);
  };

  const buttonRef = useRef<HTMLButtonElement>(null);

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

  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const handleSelect = (groupId: string) => {
    if (selectedGroupId === groupId) {
      setSelectedGroupId(null);
      onClickApply([]);
    } else {
      setSelectedGroupId(groupId);
      getStationFilterGroupById(groupId);
    }
    handleClick();
  };

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
            <div>
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
                    onClickOpenSelectionModal();
                    setSelectedGroupId(null);
                  }}
                >
                  {t("productionFloor.apply")}
                </SecondaryButton>
              </div>
            </div>

            {filterGroups?.length !== 0 && (
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
                        onClick={() => handleSelect(group?.id)}
                        style={{
                          ...classes.departmentTicket,
                          backgroundColor:
                            selectedGroupId === group?.id ? "#e0f7fa" : "white", // Conditional styling
                          border:
                            selectedGroupId === group?.id
                              ? "2px solid #00796b"
                              : "1px solid #ccc",
                        }}
                      >
                        <span style={classes.departmentText}>
                          {group?.name}
                        </span>
                        <IconButton
                          onClick={(event) => {
                            event.stopPropagation(); // Prevent triggering the select on click
                            deleteStationFilterGroupById(group?.id);
                          }}
                        >
                          <ClearIcon style={classes.clearIconStyle} />
                        </IconButton>
                      </div>
                    ))}

                    {/* {filterGroups?.map((group, index) => {
                      return (
                        <div
                          onClick={() => getStationFilterGroupById(group?.id)}
                          key={group?.id}
                          style={classes.departmentTicket}
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
                            <ClearIcon style={classes.clearIconStyle} />
                          </IconButton>
                        </div>
                      );
                    })} */}
                  </div>
                </div>
              </>
            )}
          </Paper>
        </ClickOutside>
      )}
      <SaveSelectionModal
        openModal={openSelectionModal}
        onClose={onClickCloseSelectionModal}
        onClickSave={onClickOpenDepartmentModal}
      />
      <DepartmentModal
        openModal={openDepartmentModal}
        onClose={onClickCloseDepartmentModal}
        onClickAdd={createBoardMissionStationFilterGroup}
      />
    </div>
  );
};

export { ActionsListComponent };
