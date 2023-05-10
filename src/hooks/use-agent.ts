import { useCallback } from "react";
import { useRecoilState } from "recoil";
import { getAndSetAgents } from "@/services/hooks/get-set-agents";
import { agentLists } from "@/store/agent-lists";
import { useGomakeAxios } from "./use-gomake-axios";

const useAgent= () => {
  const { callApi } = useGomakeAxios();
  const [agents, setAgents] = useRecoilState(agentLists);
 

  const getAgent = useCallback(async () => {
    await getAndSetAgents(callApi, setAgents);
  }, []);

  return {
    getAgent,
    agents,
  };
};

export { useAgent };
