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
    const {primaryColor} = useGomakeTheme();
    const {classes} = useStyle();
    const setAgents = useSetRecoilState(agentsState);
    const agents = useRecoilValue(agentsState);
    const setSelectedAgentsIds = useSetRecoilState(selectedAgentIdsState);
    const selectedAgents = useRecoilValue(selectedAgentIdsState);
    const [filter, setFilter] = useState<string>();
    useEffect(() => {
        callApi('GET', '/agents', {}, true, true).then((res) => {
            if (res && res.success) {
                setAgents(res.data);
            }
        })
    }, [])
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const getAgentsList = useCallback(() => {
        const agentsList =  agents.map(agent => ({label: agent.name, id: agent.id,checked:false}));
        return agentsList;
    }, [agents]);
    const setAgentChecked = (agentId: string) => {
        debugger;
        const updatedAgents:any[] = getAgentsList().map((agent) => {
            if (agent.id === agentId) {
                agent.checked = !agent.checked;
            }
            return agent
        });
        setAgents(updatedAgents)
    };
    const checkAllAgents = ()=> {
        
    }
    const handleChange = (e: any, value: any) => {
        let agentIds = [];
        if(value && value.length  >0){
            if(value.length == 1 && value.find((x:any)=>x.id == "all")){
                const allAgents = getAgentsList();
                agentIds = allAgents.map((x:any) => x.id)
            }else{
                agentIds = value.map((x:any) => x.id)
            }
            
        }
        setSelectedAgentsIds(agentIds);
    }
    const handleFilterChange = (event: FormEvent<HTMLInputElement>) => {
        setFilter(event.currentTarget.value);
    }
    return (
        <div style={{width:'200px'}}>
            <div>
                <Button style={classes.button} variant={'contained'} onClick={handleClick}>
                    <span>{t('machines-list-widget.machinesList')}</span>
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
                            <GomakeTextInput  placeholder={'search machine'} value={filter} onChange={handleFilterChange}/>
                        </div>
                        <MenuItem style={classes.machineName}>
                            <FormControlLabel  label={t('dashboard-widget.all')}
                                               control={<Checkbox checked={getAgentsList().every(agent => agent.checked)}
                                                                  onChange={() => {
                                                                      checkAllAgents();
                                                                  }}/>}
                            />
                        </MenuItem>
                        {
                            getAgentsList().map((agent:any) => {
                                return <MenuItem style={classes.machineName} key={agent.id}>
                                    <FormControlLabel  label={agent.label}
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


