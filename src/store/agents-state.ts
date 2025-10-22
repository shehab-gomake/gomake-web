import { CurrentStationOrderingEnum } from "@/enums";
import { atom, selector } from "recoil";
const agentsState = atom<
  { id: string; name: string; code: string; checked: boolean }[]
>({
  key: "agentsState", // unique ID (with respect to other atoms/selectors)
  default: [], // default value (aka initial value)
});

const selectedAgentsState = selector<string[]>({
  key: "selectedAgentsState",
  get: ({ get }) => {
    const agents = get(agentsState);
    return agents.filter((agent) => agent.checked).map((agent) => agent.id);
  },
});
const currentStationOrderingState = atom<CurrentStationOrderingEnum>({
  key: "currentStationOrderingState",
  default: CurrentStationOrderingEnum.NONE,
});

const deliveryTimeOrderingState = atom<CurrentStationOrderingEnum>({
  key: "deliveryTimeOrderingState",
  default: CurrentStationOrderingEnum.NONE,
});

const createDateOrderingState = atom<CurrentStationOrderingEnum>({
  key: "createDateOrderingState",
  default: CurrentStationOrderingEnum.NONE,
});

export {
  agentsState,
  selectedAgentsState,
  currentStationOrderingState,
  deliveryTimeOrderingState,
  createDateOrderingState,
};
