import { useTranslation } from "react-i18next";
import { IInput } from "@/widgets/machines/utils/interfaces-temp/inputs-interfaces";
import { useRecoilState } from "recoil";
import { employeeState } from "@/store/employee-state";
import { useStyle } from "@/widgets/settings-users/users/components/add-employee/components/general-form/style";
import {
    employeeInfoInputs
} from "@/widgets/settings-users/users/components/add-employee/components/general-form/inputs/employee-info-inputs";
import {
    agentInputs,
} from "@/widgets/settings-users/users/components/add-employee/components/general-form/inputs/agent-inputs";
import {
    ipAddressesInputs
} from "@/widgets/settings-users/users/components/add-employee/components/general-form/inputs/ip-addresses-inputs";
import {
    accountInputs
} from "@/widgets/settings-users/users/components/add-employee/components/general-form/inputs/account-inputs";
import { useCallback, useEffect, useState } from "react";
import { EmployeeActions } from "@/widgets/settings-users/users/enums/employee-actions";
import { AllowedIP, IUserData } from "@/widgets/settings-users/users/interface/employee";
import { SecondSwitch } from "@/components";
import { FormArrayInput } from "@/components/form-inputs/form-array-input";
import { FormInput } from "@/components/form-inputs/form-input";
import { getAllActionsRequireEmployeeApi } from "@/services/api-service/production-floor/production-floor-endpoints";
import { useGomakeAxios } from "@/hooks";
import { Checkbox } from "@mui/material";
import { CheckboxCheckedIcon, CheckboxIcon } from "@/icons";

const EmployeeGeneralForm = ({ action }: { action: EmployeeActions }) => {
    const { t } = useTranslation();
    const { classes } = useStyle();
    const [state, setState] = useRecoilState<IUserData>(employeeState);
    console.log("state", state)
    const [actionRequierdForEmployee, setActionRequierdForEmployee] = useState([])
    const { callApi } = useGomakeAxios();

    const getActions = async () => {
        const callBack = res => {
            if (res.success) {
                setActionRequierdForEmployee(res?.data);
            }
        }
        await getAllActionsRequireEmployeeApi(callApi, callBack)
    }
    useEffect(() => {
        getActions()
    }, [])
    const updateEmployeeState = (key, value) => {
        setState({
            ...state,
            employee: {
                ...state.employee,
                [key]: value
            }
        });
    };
    const updateActionIdsEmployeeState = (key, id, checked) => {
        setState(prevState => {
            // Get the current list of actionIds
            const currentActionIds = prevState.employee[key] || [];

            // Update the list based on the checked state
            const updatedActionIds = checked
                ? [...currentActionIds, id]
                : currentActionIds.filter(actionId => actionId !== id);

            return {
                ...prevState,
                employee: {
                    ...prevState.employee,
                    [key]: updatedActionIds
                }
            };
        });
    };
    const updateUserState = (key, value) => {
        setState({
            ...state,
            [key]: value
        });
    };

    const updateIpState = (key, value: AllowedIP[]) => {
        const updatedValue = value?.map(row => row.isActive === undefined ? ({ ...row, isActive: true }) : row);
        setState({
            ...state,
            allowedIPs: updatedValue
        })
    };

    const handelIsAgentChange = () => {
        setState({
            ...state,
            employee: {
                ...state.employee,
                isAgent: !state.employee.isAgent
            }
        })
    }

    const inputs = useCallback(() => {
        return {
            employee: employeeInfoInputs(state.employee),
            account: accountInputs(state, action),
            agent: agentInputs(state.employee),
            ips: ipAddressesInputs(state)
        }
    }, [state]);


    return (
        <div style={classes.container}>
            <div style={classes.subSection}>
                <h3 style={classes.subSectionHeader}>{t('usersSettings.employeeInfo')}</h3>
                <div style={classes.inputsContainer}>
                    {
                        inputs().employee.map(employee => <FormInput key={employee.parameterKey}
                            input={employee as IInput}
                            changeState={updateEmployeeState}
                            error={employee.required && !state.employee[employee.parameterKey]} />)
                    }
                </div>
            </div>
            <div style={classes.subSection}>
                <h3 style={classes.subSectionHeader}>{t('usersSettings.account')}</h3>
                <div style={classes.inputsContainer}>
                    {
                        inputs().account.map(employee => <FormInput key={employee.parameterKey}
                            input={employee as IInput}
                            changeState={updateUserState}
                            error={employee.required && !state[employee.parameterKey]} />)
                    }
                </div>
            </div>
            <div style={classes.subSection}>
                <div>
                    <span>{t("usersSettings.isAgent")}</span>
                    <SecondSwitch checked={!!state.employee.isAgent} onChange={handelIsAgentChange} />
                </div>
                {
                    !!state.employee.isAgent && <>
                        <h3 style={classes.subSectionHeader}>{t('usersSettings.agent')}</h3>
                        <div style={classes.inputsContainer}>
                            {
                                inputs().agent.map(employee => <FormInput key={employee.parameterKey}
                                    input={employee as IInput}
                                    changeState={updateEmployeeState}
                                    error={employee.required && !state.employee[employee.parameterKey]} />)
                            }
                        </div>
                    </>
                }
            </div>
            <div style={classes.subSection}>
                <div style={classes.inputsContainer}>
                    {
                        inputs().ips.map(employee => <FormArrayInput name={employee.name}
                            key={employee.parameterKey}
                            parameterKey={employee.parameterKey}
                            value={employee.value}
                            inputs={employee.inputs ? employee.inputs : []}
                            updateState={updateIpState}
                            isValid={true}
                        />)
                    }
                </div>
            </div>


            <div style={classes.subSection}>
                <h3 style={classes.subSectionHeader}>Employee actions</h3>
                <h1 style={classes.subSectionActionHeader}>Actions</h1>
                <div style={classes.inputsContainer}>
                    {
                        actionRequierdForEmployee?.map((action) => {
                            return (
                                <div>
                                    <Checkbox
                                        onChange={(e, checked) => { updateActionIdsEmployeeState("actionIds", action.id, checked) }}
                                        icon={<CheckboxIcon />}
                                        checkedIcon={<CheckboxCheckedIcon />}
                                        checked={state?.employee?.actionIds?.includes(action?.id)}
                                    />
                                    {action?.name}
                                </div>
                            )
                        })
                    }

                </div>
            </div>


        </div>
    );
}

export { EmployeeGeneralForm };