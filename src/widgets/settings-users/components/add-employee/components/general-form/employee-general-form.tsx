import {useTranslation} from "react-i18next";
import {MachineInput} from "@/widgets/machines/components/inputs/machine-inputs";
import {IInput} from "@/widgets/machines/utils/interfaces-temp/inputs-interfaces";
import {useRecoilState} from "recoil";
import {employeeState} from "@/store/employee-state";
import {MachineMultiArrayInput} from "@/widgets/machines/components/inputs/machine-multi-array-input";
import {useStyle} from "@/widgets/settings-users/components/add-employee/components/general-form/style";
import {
    employeeInfoInputs
} from "@/widgets/settings-users/components/add-employee/components/general-form/inputs/employee-info-inputs";
import {
    agentInputs
} from "@/widgets/settings-users/components/add-employee/components/general-form/inputs/agent-inputs";
import {
    ipAddressesInputs
} from "@/widgets/settings-users/components/add-employee/components/general-form/inputs/ip-addresses-inputs";
import {
    accountInputs
} from "@/widgets/settings-users/components/add-employee/components/general-form/inputs/account-inputs";
import {useCallback, useEffect} from "react";

const EmployeeGeneralForm = () => {
    const {t} = useTranslation();
    const {classes} = useStyle();
    const [state, setState] = useRecoilState(employeeState);
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

    const inputs = useCallback(() => {
        return {
            employee: employeeInfoInputs(state.employee),
            account: accountInputs(state),
            agent: agentInputs(state.employee),
            ips: ipAddressesInputs(state)
        }
    }, [state]);

    useEffect(() => console.log(state), [state])
    return (
        <div style={classes.container}>
            <div style={classes.subSection}>
                <h3 style={classes.subSectionHeader}>{t('usersSettings.employeeInfo')}</h3>
                <div style={classes.inputsContainer}>
                    {
                        inputs().employee.map(employee => <MachineInput key={employee.parameterKey}
                                                                                         input={employee as IInput}
                                                                                         changeState={updateEmployeeState}
                                                                                         error={false}/>)
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
                                                                           error={false}/>)
                    }
                </div>
            </div>
            <div style={classes.subSection}>
                <h3 style={classes.subSectionHeader}>{t('usersSettings.agent')}</h3>
                <div style={classes.inputsContainer}>
                    {
                        inputs().agent.map(employee => <MachineInput key={employee.parameterKey}
                                                                                  input={employee as IInput}
                                                                                  changeState={updateEmployeeState}
                                                                                  error={false}/>)
                    }
                </div>
            </div>
            <div style={classes.subSection}>
                <div style={classes.inputsContainer}>
                    {
                        inputs().ips.map(employee => <MachineMultiArrayInput name={employee.name}
                                                                                         key={employee.parameterKey}
                                                                                         parameterKey={employee.parameterKey}
                                                                                         value={employee.value}
                                                                                         inputs={employee.inputs as IInput[]}
                                                                                         updateState={updateUserState}
                                                                                         isValid={true}
                        />)
                    }
                </div>
            </div>
        </div>
    );
}

export {EmployeeGeneralForm};