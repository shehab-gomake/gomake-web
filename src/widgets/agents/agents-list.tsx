import React, {useCallback, useEffect} from "react";
import {useGomakeAxios} from "@/hooks";
import {useRecoilValue, useSetRecoilState} from "recoil";
import {Autocomplete, Box} from "@mui/material";
import TextField from "@mui/material/TextField";
import {useTranslation} from "react-i18next";
import {styled} from "@mui/material/styles";
import {useGomakeTheme} from "@/hooks/use-gomake-thme";
import { AccountCircle } from "@mui/icons-material";
import {selectedAgentIdsState} from "@/widgets/agents/state/selected-agent-id";
import {agentsState} from "@/store/agents-state";
import {GoMakeAutoComplate} from "@/components/auto-complete";



const Input = styled(TextField)(() => {
    const {primaryColor} = useGomakeTheme();
    return {
        input: {
            backgroundColor: "#FFFFFF",
            boxSizing: "border-box",
            borderRadius: '10px',
            fontFamily: "Jost",
            fontStyle: "normal",
            fontWeight: 300,
            fontSize: 14,
            lineHeight: "21px",
            display: "flex",
            alignItems: "center",
            width: "100%",
            color: primaryColor(500),
        },

        "& .MuiOutlinedInput-root": {
            "&:hover fieldset": {
                border: `2px solid ${primaryColor(500)}`

            },
            "& fieldset": {
                border: `1px solid ${primaryColor(500)}`,
                boxSizing: "border-box",
                borderRadius: 10,
                width: "100%",
            },
            "&.Mui-focused fieldset": {
                borderColor:primaryColor(500),
                borderRadius: 10,
                width: "100%",
            },
        },
        '& .MuiInputBase-root': {
            height: 40
        },
    }
});

const AutoSearch = styled(Autocomplete)(() => {
    return {
        '& .MuiAutocomplete-root,': {
            width: '200px',
            border: 0,

        }
    }
});
const AgentsList = () => {
    const {t} = useTranslation();
    const {callApi} = useGomakeAxios();
    const setAgents = useSetRecoilState(agentsState);
    const agents = useRecoilValue(agentsState);
    const setSelectedAgentsIds = useSetRecoilState(selectedAgentIdsState);
    const selectedAgents = useRecoilValue(selectedAgentIdsState);
    useEffect(() => {
        callApi('GET', '/agents', {}, true, true).then((res) => {
            if (res && res.success) {
                setAgents(res.data);
            }
        })
    }, [])

    const getClientsList = useCallback(() => {
        return agents.map(agent => ({label: agent.name, id: agent.id}))
    }, [agents]);

    const handleChange = (e: any, value: any) => {
        let agentIds = [];
        if(value && value.length  >0){
            agentIds = value.map((x:any) => x.id)
        }
        setSelectedAgentsIds(agentIds);
    }
    return (
        <div style={{width:'200px'}}>
            <GoMakeAutoComplate
                placeholder={t('dashboard-widget.agents')}
                options={getClientsList()}
                //style={clasess.multiSelectStyle}
                multiple
                onChange={handleChange}
                value={selectedAgents.map((item: any) => {
                    const agent = getClientsList()?.find(
                        (agent: any) => agent?.id === item
                    );
                    return {
                        label: agent?.label,
                        id: agent?.id,
                    };
                })}
            />
            {
                /* <AutoSearch
                fullWidth={true}
                forcePopupIcon={false}
                onChange={handleChange}
                renderInput={(params) => <Box sx={{ position: 'relative' }}>
                    <Input {...params} placeholder={t('dashboard-widget.agents') as string}/>
                    <AccountCircle sx={{ position: 'absolute', left: '5px', top: '8px', color: 'action.active'}} />
                </Box>}
                options={getClientsList()}/>  value={/*productState?.groups?.map((item: any) => {
                    const group = allGroups?.find(
                        (group: any) => group?.id === item
                    );
                    return {
                        label: group?.label,
                        id: group?.id,
                    };
                })*/
            }
        </div>
    );
};

export {AgentsList}


