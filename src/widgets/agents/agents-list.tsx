import React, { FormEvent, useCallback, useEffect, useState } from "react";
import { useGomakeAxios } from "@/hooks";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import { useTranslation } from "react-i18next";
import { agentsState } from "@/store/agents-state";
import Button from "@mui/material/Button";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { GomakeTextInput } from "@/components";
import MenuItem from "@mui/material/MenuItem";
import { useStyle } from "@/widgets/machine-list/style";
import { StyledMenu } from "@/widgets";
import { getAndSetEmployees2 } from "@/services/api-service/customers/employees-api";


const AgentsList = () => {
    const { t } = useTranslation();
    const { callApi } = useGomakeAxios();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const { classes } = useStyle();
    const setAgents = useSetRecoilState(agentsState);
    const agents = useRecoilValue(agentsState);
    const [filter, setFilter] = useState<string>();

    const getAgentCategories = async (isAgent: boolean) => {
        const callBack = (res) => {
            if (res.success) {
                const agentNames = res.data.map((agent) => ({
                    label: agent.text,
                    id: agent.value,
                    checked: false
                }));
                setAgents(agentNames);
            }
        };
        await getAndSetEmployees2(callApi, callBack, { isAgent: isAgent });
    };
    useEffect(() => {
        getAgentCategories(true)
    }, [])
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const getAgents = () => {
        if (filter) {
            return agents.filter((agent) => agent.name.toLowerCase().includes(filter.toLowerCase()));
        } else {
            return agents;
        }
    }


    const setAgentChecked = useCallback((agentId: string) => {
        const updatedAgents: any[] = agents.map((agent) => {
            if (agent.id === agentId) {
                return { ...agent, checked: !agent.checked }
            }
            return agent
        });
        setAgents(updatedAgents)
    }, [agents]);
    const checkAllAgents = () => {
        const isChecked = agents.every(agent => agent.checked);
        const updatedAgents: any[] = agents.map((agent) => {
            return { ...agent, checked: !isChecked }
        });
        setAgents(updatedAgents)
    }
    const handleFilterChange = (event: FormEvent<HTMLInputElement>) => {
        setFilter(event.currentTarget.value);
    }
    return (
        <div style={{ width: '200px' }}>
            <div>
                <Button style={classes.button} variant={'contained'} onClick={handleClick}>
                    <span>{t('dashboard-widget.agents')}</span>
                    <KeyboardArrowDownIcon />
                </Button>
                <StyledMenu anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{
                        'aria-labelledby': 'basic-button',
                    }}>
                    <FormGroup>
                        <div style={classes.searchInput}>
                            <GomakeTextInput placeholder={'search'} value={filter} onChange={handleFilterChange} />
                        </div>
                        <MenuItem style={classes.machineName}>
                            <FormControlLabel label={t('dashboard-widget.all')}
                                control={<Checkbox checked={getAgents().every(agent => agent.checked)}
                                    onChange={() => {
                                        checkAllAgents();
                                    }} />}
                            />
                        </MenuItem>
                        {
                            getAgents().map((agent: any) => {
                                return <MenuItem style={classes.machineName} key={agent.id}>
                                    <FormControlLabel label={agent.label}
                                        control={<Checkbox checked={agent.checked}
                                            onChange={() => {
                                                setAgentChecked(agent.id)
                                            }} />}
                                    />
                                </MenuItem>

                            })
                        }
                    </FormGroup>
                </StyledMenu>
            </div>
        </div>
    );
};

export { AgentsList }


