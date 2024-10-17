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
import { SaveIcon } from "@/widgets/production-floor/header/components/icons/save-icon";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";

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
  } = useActionsList({ source, onClickApply, filterGroups, setFilterGroups });

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
                    source === Source.PRODUCTION_FLOOR
                      ? handleClickSave()
                      : onClickApply(actionsMachinesIds);
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
