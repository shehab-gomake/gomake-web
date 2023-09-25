import { useTranslation } from "react-i18next";
import { GoMakeAutoComplate } from "@/components";
import { Skeleton } from "@mui/material";
import { useStyle } from "./style";
import * as React from 'react';
import { SearchInputComponent } from "@/components/form-inputs/search-input-component";
import { SecondaryButton } from "@/components/button/secondary-button";

interface IProps {
    typeClient?: string;
    agentsCategories?: string[];
    clientTypesCategories?: any[];
    statuses?: any[];
    onChangeAgent?: (key: string, value: any) => void;
    onChangeCustomer?: (value: string) => void;
    onChangeClientType?: (key: string, value: any) => void;
    onChangeStatus?: (key: string, value: any) => void;
    handleClean?: () => void;
    agentName?: string[];
    customerName?: string;
    valClientType?: string[];
    valStatus?: string[];
  }

  
const HeaderFilter = ({ typeClient, agentsCategories, clientTypesCategories, statuses, onChangeAgent, onChangeCustomer, onChangeClientType, onChangeStatus, handleClean, customerName, agentName, valClientType, valStatus }: IProps) => {
    const { t } = useTranslation();
    const { classes } = useStyle();

    return (
        <div style={classes.subHeaderContainer} >
            <div style={classes.filterContainer}>
                {typeClient == "C" ? (
                    <>
                        {agentsCategories?.length > 0 ? (
                            <GoMakeAutoComplate
                                options={agentsCategories}
                                style={classes.dropDownListStyle}
                                placeholder={t("customers.selectAgent")}
                                onChange={onChangeAgent}
                                value={agentName}
                            />
                        ) : (
                            <Skeleton variant="rectangular" width={200} height={40} />
                        )}
                        {clientTypesCategories?.length > 0 ? (
                            <GoMakeAutoComplate
                                options={clientTypesCategories}
                                style={classes.dropDownListStyle}
                                placeholder={t("customers.selectCustomerType")}
                                onChange={onChangeClientType}
                                value={valClientType}
                            />
                        ) : (
                            <Skeleton variant="rectangular" width={200} height={40} />)}
                        {statuses?.length > 0 ? (
                            <GoMakeAutoComplate
                                options={statuses}
                                style={classes.dropDownListStyle}
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
                                style={classes.dropDownListStyle}
                                placeholder={t("customers.selectStatus")}
                                onChange={onChangeStatus}
                                value={valStatus}
                                disableClearable={true}
                            />
                        ) : (
                            <Skeleton variant="rectangular" width={200} height={40} />
                        )}  </>
                )}
                <SecondaryButton style={classes.cleanBtnStyle} onClick={handleClean} >{t("customers.buttons.clean")}</SecondaryButton>
            </div>
            <div>
                <SearchInputComponent onChange={onChangeCustomer} value={customerName}></SearchInputComponent>
            </div>
        </div>
    );
};
export { HeaderFilter };
