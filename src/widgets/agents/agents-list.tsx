import React, {FormEvent, useCallback, useEffect, useState} from "react";
import {useGomakeAxios} from "@/hooks";
import {useRecoilValue, useSetRecoilState} from "recoil";
import {Autocomplete, Box, Checkbox, FormControlLabel, FormGroup} from "@mui/material";
import TextField from "@mui/material/TextField";
import {useTranslation} from "react-i18next";
import {styled} from "@mui/material/styles";
import {useGomakeTheme} from "@/hooks/use-gomake-thme";
import { AccountCircle } from "@mui/icons-material";
import {selectedAgentIdsState} from "@/widgets/agents/state/selected-agent-id";
import {agentsState} from "@/store/agents-state";
import {GoMakeAutoComplate} from "@/components/auto-complete";
import Button from "@mui/material/Button";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import {GomakeTextInput} from "@/components";
import MenuItem from "@mui/material/MenuItem";
import {IMachine} from "@/shared";
import {useStyle} from "@/widgets/machine-list/style";
import {StyledMenu} from "@/widgets";


const AgentsList = () => {
    const {t} = useTranslation();
    const {callApi} = useGomakeAxios();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const {classes} = useStyle();
    const setAgents = useSetRecoilState(agentsState);
    const agents = useRecoilValue(agentsState);
    const [filter, setFilter] = useState<string>();
    useEffect(() => {
        callApi('GET', '/agents', {}, true, true).then((res) => {
            if (res && res.success) {
                const agentsResult = res.data;
                agentsResult.forEach((x:any) => x.checked = false);
                setAgents(agentsResult);
            }
        })
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
        }else {
            return agents;
        }
    }
   
    
    const setAgentChecked = useCallback((agentId: string) => {
        const updatedAgents:any[] = agents.map((agent) => {
            if (agent.id === agentId) {
                return {...agent, checked: !agent.checked}
            }
            return agent
        });
        setAgents(updatedAgents)
    }, [agents]);
    const checkAllAgents = ()=> {
        const isChecked = agents.every(agent => agent.checked);
        const updatedAgents:any[] = agents.map((agent) => {
            return {...agent, checked: !isChecked}
        });
        setAgents(updatedAgents)
    }
    const handleFilterChange = (event: FormEvent<HTMLInputElement>) => {
        setFilter(event.currentTarget.value);
    }
    return (
        <div style={{width:'200px'}}>
            <div>
                <Button style={classes.button} variant={'contained'} onClick={handleClick}>
                    <span>{t('dashboard-widget.agents')}</span>
                    <KeyboardArrowDownIcon/>
                </Button>
                <StyledMenu  anchorEl={anchorEl}
                             open={open}
                             onClose={handleClose}
                             MenuListProps={{
                                 'aria-labelledby': 'basic-button',
                             }}>
                    <FormGroup>
                        <div style={classes.searchInput}>
                            <GomakeTextInput  placeholder={'search'} value={filter} onChange={handleFilterChange}/>
                        </div>
                        <MenuItem style={classes.machineName}>
                            <FormControlLabel  label={t('dashboard-widget.all')}
                                               control={<Checkbox checked={getAgents().every(agent => agent.checked)}
                                                                  onChange={() => {
                                                                      checkAllAgents();
                                                                  }}/>}
                            />
                        </MenuItem>
                        {
                            getAgents().map((agent:any) => {
                                return <MenuItem style={classes.machineName} key={agent.id}>
                                    <FormControlLabel  label={agent.name}
                                                       control={<Checkbox checked={agent.checked}
                                                                          onChange={() => {
                                                                              setAgentChecked(agent.id)
                                                                          }}/>}
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

export {AgentsList}


