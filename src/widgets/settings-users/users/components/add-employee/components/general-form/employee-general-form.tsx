import { useTranslation } from "react-i18next";
import { IInput } from "@/widgets/machines/utils/interfaces-temp/inputs-interfaces";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { employeeState } from "@/store/employee-state";
import { useStyle } from "@/widgets/settings-users/users/components/add-employee/components/general-form/style";
import { employeeInfoInputs } from "@/widgets/settings-users/users/components/add-employee/components/general-form/inputs/employee-info-inputs";
import { agentInputs } from "@/widgets/settings-users/users/components/add-employee/components/general-form/inputs/agent-inputs";
import { ipAddressesInputs } from "@/widgets/settings-users/users/components/add-employee/components/general-form/inputs/ip-addresses-inputs";
import { accountInputs } from "@/widgets/settings-users/users/components/add-employee/components/general-form/inputs/account-inputs";
import { useCallback, useEffect, useState } from "react";
import {
  EmployeeActions,
  EmployeeQuoteLimitationType,
} from "@/widgets/settings-users/users/enums/employee-actions";
import {
  AllowedIP,
  IUserData,
} from "@/widgets/settings-users/users/interface/employee";
import { GomakeTextInput, SecondSwitch } from "@/components";
import { FormArrayInput } from "@/components/form-inputs/form-array-input";
import { FormInput } from "@/components/form-inputs/form-input";
import { getAllActionsRequireEmployeeApi } from "@/services/api-service/production-floor/production-floor-endpoints";
import { useGomakeAxios } from "@/hooks";
import {
  Button,
  Checkbox,
  Stack,
  styled,
  Tooltip,
  tooltipClasses,
  TooltipProps,
} from "@mui/material";
import { CheckboxCheckedIcon, CheckboxIcon } from "@/icons";
import NewReleasesOutlinedIcon from "@mui/icons-material/NewReleasesOutlined";
import { printNodeInputs } from "@/widgets/settings-users/users/components/add-employee/components/general-form/inputs/print-node-inputs";
import { usePrintNodePrinters } from "@/hooks/use-print-node-printers";
import { getAllSMSTemplatesListApi } from "@/services/api-service/mailing/mailing-api";
import { allSMSTemplatesListState } from "@/store";
import { userProfileState } from "@/store/user-profile";
import { MissionsStationsModal } from "../missions-stations-form/missions-stations-modal";
import { useModal } from "@/hooks/use-modal";
import { usePrintHouseActionsList } from "@/hooks/use-print-house-actions";
import { PenIcon } from "@/icons/pen-icon";
import { productionFloorColorInputs } from "./inputs/production-floor-color-inputs";
import { mailingInputs } from "./inputs/mailing-inputs";
import { printHouseProfile } from "@/store/print-house-profile";

const EmployeeGeneralForm = ({ action }: { action: EmployeeActions }) => {
  const { t } = useTranslation();
  const manageStationsModal = useModal();
  const { actions } = usePrintHouseActionsList();
  const dir: "rtl" | "ltr" = t("direction");
  const RTL = dir === "rtl";
  const { classes } = useStyle();
  const [state, setState] = useRecoilState<IUserData>(employeeState);
  const [actionRequierdForEmployee, setActionRequierdForEmployee] = useState(
    []
  );
  const profileState = useRecoilValue(userProfileState);
  const printHouseProfileState = useRecoilValue(printHouseProfile);

  const { callApi } = useGomakeAxios();
  const { printers, isPrintHouseUsePrintNode, getPrinterBins } =
    usePrintNodePrinters();

  const getActions = async () => {
    const callBack = (res) => {
      if (res.success) {
        setActionRequierdForEmployee(res?.data);
      }
    };
    await getAllActionsRequireEmployeeApi(callApi, callBack);
  };

  useEffect(() => {
    getActions();
  }, []);

  const updateEmployeeState = (key, value) => {
    if (key === "quoteLimitationType") {
      const newValue = value === "" || value === null ? 0 : value;
      setState({
        ...state,
        employee: {
          ...state.employee,
          quotePriceLimit: 0,
          [key]: newValue,
        },
      });
    } else if (key === "systemLanguage") {
      setState({
        ...state,
        [key]: value,
      });
    } else
      setState({
        ...state,
        employee: {
          ...state.employee,
          [key]: value,
        },
      });
  };

  const updateActionIdsEmployeeState = (key, id, checked) => {
    setState((prevState) => {
      // Get the current list of actionIds
      const currentActionIds = prevState.employee[key] || [];

      // Update the list based on the checked state
      const updatedActionIds = checked
        ? [...currentActionIds, id]
        : currentActionIds.filter((actionId) => actionId !== id);

      return {
        ...prevState,
        employee: {
          ...prevState.employee,
          [key]: updatedActionIds,
        },
      };
    });
  };

  const updateUserState = (key, value) => {
    setState({
      ...state,
      [key]: value,
    });
  };

  const updateIpState = (key, value: AllowedIP[]) => {
    const updatedValue = value?.map((row) =>
      row.isActive === undefined ? { ...row, isActive: true } : row
    );
    setState({
      ...state,
      allowedIPs: updatedValue,
    });
  };

  const handelIsAgentChange = () => {
    setState({
      ...state,
      employee: {
        ...state.employee,
        isAgent: !state.employee.isAgent,
      },
    });
  };

  useEffect(() => {
    if (!state?.systemLanguage && profileState?.systemLang) {
      setState((prev) => ({
        ...prev,
        systemLanguage: profileState.systemLang,
      }));
    }
  }, [profileState?.systemLang, state?.systemLanguage]);

  const setAllSMSTemplatesList = useSetRecoilState<any>(
    allSMSTemplatesListState
  );

  const getAllSMSTemplatesList = useCallback(async () => {
    await getAllSMSTemplatesListApi(
      callApi,
      (fetchedData: any) => {
        // Add the default option
        const templatesWithDefault = [
          { text: t("customers.modal.default"), value: null },
          ...fetchedData.data.map((group: any) => ({
            text: group.text,
            value: group.value,
          })),
        ];
        setAllSMSTemplatesList(templatesWithDefault);
      },
      {}
    );
  }, []);

  useEffect(() => {
    getAllSMSTemplatesList();
  }, []);

  const quoteLimitationOptions = Object.keys(EmployeeQuoteLimitationType)
    .filter((key) => isNaN(Number(key)))
    .map((key) => ({
      value: EmployeeQuoteLimitationType[key],
      text: t(`usersSettings.${key}`),
    }));

  const inputs = useCallback(() => {
    return {
      employee: employeeInfoInputs(
        state.employee,
        state,
        quoteLimitationOptions
      ),
      account: accountInputs(state, action),
      // agent: agentInputs(state.employee),
      mailing: mailingInputs(
        state.employee,
        printHouseProfileState?.mailingProviderType,
        t
      ),
      ips: ipAddressesInputs(state),
      printNode: printNodeInputs(
        state.employee,
        printers.map((printer) => ({
          ...printer,
          text: printer.printerName,
          value: printer.printerId.toString(),
        })),
        getPrinterBins(state.employee.printerId).map((bin) => ({
          text: bin,
          value: bin,
        }))
      ),
      productionFloorColor: productionFloorColorInputs(state.employee),
    };
  }, [state, printers]);

  const allInputs = inputs();

  const CustomWidthTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))({
    [`& .${tooltipClasses.tooltip}`]: {
      maxWidth: 600,
    },
  });

  return (
    <div style={classes.container}>
      <div style={classes.subSection}>
        <h3 style={classes.subSectionHeader}>
          {t("usersSettings.employeeInfo")}
        </h3>
        <div style={classes.inputsContainer}>
          {inputs().employee.map((employee) => (
            <FormInput
              key={employee.parameterKey}
              input={employee as IInput}
              changeState={updateEmployeeState}
              error={
                employee.required && !state.employee[employee.parameterKey]
              }
            />
          ))}
        </div>
      </div>
      <div style={classes.subSection}>
        <h3 style={classes.subSectionHeader}>{t("usersSettings.account")}</h3>
        <div style={classes.inputsContainer}>
          {inputs().account.map((employee) => (
            <div key={employee.parameterKey} style={{ display: "flex" }}>
              <FormInput
                input={employee as IInput}
                changeState={updateUserState}
                error={employee.required && !state[employee.parameterKey]}
              />

              {action === EmployeeActions.UPDATE &&
                !!state.employee.isAgent &&
                !state?.isMailVerified &&
                employee.parameterKey === "email" && (
                  <div style={{ display: "flex", alignSelf: "end" }}>
                    <CustomWidthTooltip
                      title={t("usersSettings.emailNotVerified")}
                      placement={RTL ? "bottom-start" : "bottom-end"}
                      style={{ maxWidth: "fit-content" }}
                    >
                      <NewReleasesOutlinedIcon
                        sx={{ color: "#007bff", fontSize: 20 }}
                      />
                    </CustomWidthTooltip>
                  </div>
                )}
            </div>
          ))}
        </div>
      </div>
      <div style={classes.subSection}>
        <div>
          <span>{t("usersSettings.isAgent")}</span>
          <SecondSwitch
            checked={!!state.employee.isAgent}
            onChange={handelIsAgentChange}
          />
        </div>
      </div>
      {!!state?.employee?.isAgent && (
        <div style={classes.subSection}>
          <h3 style={classes.subSectionHeader}>{t("settings.mailing")}</h3>
          <div style={classes.inputsContainer}>
            {allInputs.mailing.map((employee) => (
              <FormInput
                key={employee.parameterKey}
                input={employee as IInput}
                changeState={updateEmployeeState}
                error={
                  employee.required && !state.employee[employee.parameterKey]
                }
                readonly={!!employee.readonly}
              />
            ))}
          </div>
        </div>
      )}
      <div style={classes.subSection}>
        <div style={classes.inputsContainer}>
          {inputs().ips.map((employee) => (
            <FormArrayInput
              name={employee.name}
              key={employee.parameterKey}
              parameterKey={employee.parameterKey}
              value={employee.value}
              inputs={employee.inputs ? employee.inputs : []}
              updateState={updateIpState}
              isValid={true}
            />
          ))}
        </div>
      </div>
      <div style={classes.subSection}>
        <h3 style={classes.subSectionHeader}>
          {t("usersSettings.employeeActions")}
        </h3>
        <h1 style={classes.subSectionActionHeader}>
          {t("usersSettings.actions")}
        </h1>
        <div style={classes.inputsContainer}>
          {actionRequierdForEmployee?.map((action) => {
            return (
              <div>
                <Checkbox
                  onChange={(e, checked) => {
                    updateActionIdsEmployeeState(
                      "actionIds",
                      action.id,
                      checked
                    );
                  }}
                  icon={<CheckboxIcon />}
                  checkedIcon={<CheckboxCheckedIcon />}
                  checked={state?.employee?.actionIds?.includes(action?.id)}
                />
                {action?.name}
              </div>
            );
          })}
        </div>
      </div>
      <div style={classes.subSection}>
        <h3 style={classes.subSectionHeader}>
          {t("usersSettings.employeeStations")}
        </h3>
        <h1 style={classes.subSectionActionHeader}>
          {t("usersSettings.stations")}
        </h1>

        <div style={classes.inputsContainer}>
          <Button
            sx={classes.stationsButton}
            onClick={manageStationsModal.open}
            startIcon={<PenIcon />}
          >
            {t("usersSettings.manageStations")}
          </Button>
          <MissionsStationsModal
            onClickApply={(v) => updateEmployeeState("stationsFilter", v)}
            openModal={manageStationsModal.isOpen}
            onClickCloseModal={() => manageStationsModal.close()}
            actions={actions}
          />
        </div>
      </div>

      <div style={classes.subSection}>
        <h3 style={classes.subSectionHeader}>
          {t("companyReports.calculations")}
        </h3>
        <h1 style={classes.subSectionActionHeader}>
          {t("usersSettings.priceChangePercents")}
        </h1>
        <Stack direction={"row"} alignItems={"center"} gap={"10px"}>
          <GomakeTextInput
            onChange={(e) =>
              updateEmployeeState(
                "minPriceChangePercents",
                Number(e.target.value)
              )
            }
            value={state?.employee?.minPriceChangePercents}
            type={"number"}
            style={{
              width: "150px",
              height: "40px",
            }}
            placeholder={t("sales.quote.minPrice")}
          />
          -
          <GomakeTextInput
            onChange={(e) =>
              updateEmployeeState(
                "maxPriceChangePercents",
                Number(e.target.value)
              )
            }
            value={state?.employee?.maxPriceChangePercents}
            type={"number"}
            style={{
              width: "150px",
              height: "40px",
            }}
            placeholder={t("sales.quote.maxPrice")}
          />
        </Stack>
      </div>

      <div style={classes.subSection}>
        <h3 style={classes.subSectionHeader}>
          {t("machineAttributes.productionFloorColor")}
        </h3>
        <div style={classes.inputsContainer}>
          {inputs().productionFloorColor.map((color) => (
            <FormInput
              key={color.parameterKey}
              input={color as IInput}
              changeState={updateEmployeeState}
              error={false}
            />
          ))}
        </div>
      </div>

      {isPrintHouseUsePrintNode && (
        <div style={classes.subSection}>
          <h3 style={classes.subSectionHeader}>
            {t("usersSettings.printNode")}
          </h3>
          <div style={classes.inputsContainer}>
            {inputs().printNode.map((employee) => (
              <FormInput
                key={employee.parameterKey}
                input={employee as IInput}
                changeState={updateEmployeeState}
                error={
                  employee.required && !state.employee[employee.parameterKey]
                }
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export { EmployeeGeneralForm };
