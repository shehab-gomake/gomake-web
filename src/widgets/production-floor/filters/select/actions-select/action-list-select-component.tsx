import {
  cloneElement,
  FormEvent,
  ReactElement,
  useCallback,
  useRef,
} from "react";
import { Button, Divider, FormGroup, Paper } from "@mui/material";
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

interface IProps {
  onClickApply: (v: IStation[]) => void;
  source: Source;
  buttonElement?: ReactElement;
  onClickOpenDepartmentModal?: () => void;
}

const ActionsListComponent = ({
  onClickApply,
  source,
  buttonElement,
  onClickOpenDepartmentModal,
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
  } = useActionsList(source);

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

  const getDepartmentGroup = () => {
    return [
      { id: 1, name: "Printing" },
      { id: 2, name: "Quality Control" },
      { id: 3, name: "Packaging" },
      { id: 4, name: "Shipping" },
      { id: 5, name: "Shipping test" },
    ];
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
                  }}
                >
                  {t("productionFloor.apply")}
                </SecondaryButton>
              </div>
            </div>

            {getDepartmentGroup().length !== 0 && (
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
                    {getDepartmentGroup().map((option, index) => {
                      return (
                        <div key={option.id} style={classes.departmentTicket}>
                          <span style={classes.departmentText}>
                            {option.name}
                          </span>
                          <ClearIcon style={classes.clearIconStyle} />
                        </div>
                      );
                    })}
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
    </div>
  );
};

export { ActionsListComponent };
