import {atom, selector} from "recoil";
const agentsState = atom<{id: string; name: string; code: string; checked: boolean;}[]>({
    key: 'agentsState', // unique ID (with respect to other atoms/selectors)
    default: [], // default value (aka initial value)
});
const selectedAgentsState = selector<string[]>({
    key: 'selectedAgentsState',
    get: ({get}) => {
        const agents = get(agentsState);
        return agents.filter(agent => agent.checked).map(agent=> agent.id);
    },
});
export {agentsState,selectedAgentsState}