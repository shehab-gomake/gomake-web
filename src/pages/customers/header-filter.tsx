import { useTranslation } from "react-i18next";
import { GoMakeAutoComplate } from "@/components";
import { Skeleton } from "@mui/material";
import { useStyle } from "./style";
import * as React from 'react';
import { SearchInputComponent } from "@/components/form-inputs/search-input-component";
import { SecondaryButton } from "@/components/button/secondary-button";

interface IProps {
    typeClient?: string;
    agentsCategores?: any[];
    clientTypesCategores?: any[];
    statuses?: any[];
    onChangeAgent?: (key: string, value: any) => void;
    onChangeCustomer?: (value: string) => void;
    onChangeClientType?: (key: string, value: any) => void;
    onChangeStatus?: (key: string, value: any) => void;
    handleClean?: () => void;
    agentName?: any[];
    cutomerName?: string;
    valClientType?: any[];
    valStatus?: any[];
  }

const HeaderFilter = ({ typeClient, agentsCategores, clientTypesCategores, statuses, onChangeAgent, onChangeCustomer, onChangeClientType, onChangeStatus, handleClean, cutomerName, agentName, valClientType, valStatus }: IProps) => {
    const { t } = useTranslation();
    const { clasess } = useStyle();

    return (
        <div style={clasess.subHeaderContainer} >
            <div style={clasess.filterContainer}>
                {typeClient == "C" ? (
                    <>
                        {agentsCategores?.length > 0 ? (
                            <GoMakeAutoComplate
                                options={agentsCategores}
                                style={clasess.dropDownListStyle}
                                placeholder={t("customers.selectAgent")}
                                onChange={onChangeAgent}
                                value={agentName}
                            />
                        ) : (
                            <Skeleton variant="rectangular" width={200} height={40} />
                        )}
                        {clientTypesCategores?.length > 0 ? (
                            <GoMakeAutoComplate
                                options={clientTypesCategores}
                                style={clasess.dropDownListStyle}
                                placeholder={t("customers.selectCustomerType")}
                                onChange={onChangeClientType}
                                value={valClientType}
                            />
                        ) : (
                            <Skeleton variant="rectangular" width={200} height={40} />)}
                        {statuses?.length > 0 ? (
                            <GoMakeAutoComplate
                                options={statuses}
                                style={clasess.dropDownListStyle}
                                placeholder={t("customers.selectStatus")}
                                onChange={onChangeStatus}
                                value={valStatus}
                                disableClearable={true}
                            />
                        ) : (
                            <Skeleton variant="rectangular" width={200} height={40} />
                        )}
                    </>
                ) : (
                    <>
                        {statuses?.length > 0 ? (
                            <GoMakeAutoComplate
                                options={statuses}
                                style={clasess.dropDownListStyle}
                                placeholder={t("customers.selectStatus")}
                                onChange={onChangeStatus}
                                value={valStatus}
                                disableClearable={true}
                            />
                        ) : (
                            <Skeleton variant="rectangular" width={200} height={40} />
                        )}  </>
                )}
                <SecondaryButton style={clasess.cleanBtnStyle} onClick={handleClean} >{t("customers.buttons.clean")}</SecondaryButton>
            </div>
            <div>
                <SearchInputComponent onChange={onChangeCustomer} value={cutomerName}></SearchInputComponent>
            </div>
        </div>
    );
};
export { HeaderFilter };
