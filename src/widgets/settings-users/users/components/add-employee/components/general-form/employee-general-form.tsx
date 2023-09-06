import {useTranslation} from "react-i18next";
import {MachineInput} from "@/widgets/machines/components/inputs/machine-inputs";
import {IInput} from "@/widgets/machines/utils/interfaces-temp/inputs-interfaces";
import {useRecoilState} from "recoil";
import {employeeState} from "@/store/employee-state";
import {MachineMultiArrayInput} from "@/widgets/machines/components/inputs/machine-multi-array-input";
import {useStyle} from "@/widgets/settings-users/users/components/add-employee/components/general-form/style";
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
import {useCallback} from "react";
import {EmployeeActions} from "@/widgets/settings-users/users/enums/employee-actions";
import {AllowedIP, IUserData} from "@/widgets/settings-users/users/interface/employee";
import {SecondSwitch} from "@/components";

const EmployeeGeneralForm = ({action}: { action: EmployeeActions }) => {
    const {t} = useTranslation();
    const {classes} = useStyle();
    const [state, setState] = useRecoilState<IUserData>(employeeState);
    const updateEmployeeState = (key, value) => {
        setState({
            ...state,
            employee: {
                ...state.employee,
                [key]: value
            }
        });
    };
    const updateUserState = (key, value) => {
        setState({
            ...state,
            [key]: value
        });
    };

    const updateIpState = (key, value: AllowedIP[]) => {
        const updatedValue = value?.map(row => row.isActive === undefined ? ({...row, isActive: true}) : row);
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
                        inputs().employee.map(employee => <MachineInput key={employee.parameterKey}
                                                                        input={employee as IInput}
                                                                        changeState={updateEmployeeState}
                                                                        error={employee.required && !state.employee[employee.parameterKey]}/>)
                    }
                </div>
            </div>
            <div style={classes.subSection}>
                <h3 style={classes.subSectionHeader}>{t('usersSettings.account')}</h3>
                <div style={classes.inputsContainer}>
                    {
                        inputs().account.map(employee => <MachineInput key={employee.parameterKey}
                                                                       input={employee as IInput}
                                                                       changeState={updateUserState}
                                                                       error={employee.required && !state[employee.parameterKey]}/>)
                    }
                </div>
            </div>
            <div style={classes.subSection}>
                <div>
                    <span>{t("usersSettings.isAgent")}</span>
                    <SecondSwitch checked={!!state.employee.isAgent} onChange={handelIsAgentChange}/>
                </div>
                {
                    !!state.employee.isAgent && <>
                        <h3 style={classes.subSectionHeader}>{t('usersSettings.agent')}</h3>
                        <div style={classes.inputsContainer}>
                            {
                                inputs().agent.map(employee => <MachineInput key={employee.parameterKey}
                                                                             input={employee as IInput}
                                                                             changeState={updateEmployeeState}
                                                                             error={employee.required && !state.employee[employee.parameterKey]}/>)
                            }
                        </div>
                    </>
                }
            </div>
            <div style={classes.subSection}>
                <div style={classes.inputsContainer}>
                    {
                        inputs().ips.map(employee => <MachineMultiArrayInput name={employee.name}
                                                                             key={employee.parameterKey}
                                                                             parameterKey={employee.parameterKey}
                                                                             value={employee.value}
                                                                             inputs={employee.inputs ? employee.inputs: []}
                                                                             updateState={updateIpState}
                                                                             isValid={true}
                        />)
                    }
                </div>
            </div>
        </div>
    );
}

export {EmployeeGeneralForm};