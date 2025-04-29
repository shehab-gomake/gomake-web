import { FormEvent, useCallback, useEffect, useState } from "react";
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
import { PrimaryButton } from "@/components/button/primary-button";

interface IProps {
  onClickApply?: (selectedAgents: string[]) => void;
  applyButton?: boolean;
}

const AgentsList = (props: IProps) => {
  const { t } = useTranslation();
  const { callApi } = useGomakeAxios();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const { classes } = useStyle();
  const setAgents = useSetRecoilState(agentsState);
  const agents: any = useRecoilValue(agentsState);
  const [filter, setFilter] = useState<string>();
  const [localAgents, setLocalAgents] = useState<any[]>([]);

  const getAgentCategories = async (isAgent: boolean) => {
    const callBack = (res) => {
      if (res.success) {
        const agentNames = res.data.map((agent) => ({
          label: agent.text,
          id: agent.value,
          checked: false,
        }));
        setAgents(agentNames);
      }
    };
    await getAndSetEmployees2(callApi, callBack, { isAgent: isAgent });
  };

  useEffect(() => {
    getAgentCategories(true);
  }, []);

  const handleClose = () => {
    setAnchorEl(null);
    if (props.applyButton) {
      setLocalAgents(agents);
    }
  };

  const handleFilterChange = (event: FormEvent<HTMLInputElement>) => {
    setFilter(event.currentTarget.value);
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    if (props.applyButton) {
      setLocalAgents(agents); // Copy current agents into local state
    }
  };

  const getAgents = () => {
    const source = props.applyButton ? localAgents : agents;
    if (filter) {
      return source.filter((agent) =>
        (agent?.name || agent?.label)
          ?.toLowerCase()
          ?.includes(filter.toLowerCase())
      );
    } else {
      return source;
    }
  };

  const setAgentChecked = useCallback(
    (agentId: string) => {
      const source = props.applyButton ? localAgents : agents;
      const updatedAgents = source.map((agent) => {
        if (agent.id === agentId) {
          return { ...agent, checked: !agent.checked };
        }
        return agent;
      });
      if (props.applyButton) {
        setLocalAgents(updatedAgents);
      } else {
        setAgents(updatedAgents);
      }
    },
    [agents, localAgents, props.applyButton, setAgents]
  );

  const checkAllAgents = () => {
    const source = props.applyButton ? localAgents : agents;
    const isChecked = source.every((agent) => agent.checked);
    const updatedAgents = source.map((agent) => ({
      ...agent,
      checked: !isChecked,
    }));
    if (props.applyButton) {
      setLocalAgents(updatedAgents);
    } else {
      setAgents(updatedAgents);
    }
  };

  return (
    <div>
      <div>
        <Button
          style={agents && agents.length > 0 && agents.some(x=>x.checked) ? {...classes.button,...classes.buttonCheckedItem} : {...classes.button,...classes.buttonUnCheckedItem} }
          variant={"contained"}
          onClick={handleClick}
        >
          <span>{t("dashboard.agents")}</span>
          <KeyboardArrowDownIcon />
        </Button>
        <StyledMenu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
        >
          <div style={{ overflowY: "auto", maxHeight: "440px" }}>
            <FormGroup>
              <div style={classes.searchInput}>
                <GomakeTextInput
                  placeholder={"search"}
                  value={filter}
                  onChange={handleFilterChange}
                />
              </div>
              <MenuItem style={classes.machineName}>
                <FormControlLabel
                  label={t("dashboard-widget.all")}
                  control={
                    <Checkbox
                      checked={getAgents().every((agent) => agent.checked)}
                      onChange={() => {
                        checkAllAgents();
                      }}
                    />
                  }
                />
              </MenuItem>
              {getAgents().map((agent: any) => (
                <MenuItem style={classes.machineName} key={agent.id}>
                  <FormControlLabel
                    label={agent?.name || agent?.label}
                    control={
                      <Checkbox
                        checked={agent.checked}
                        onChange={() => {
                          setAgentChecked(agent.id);
                        }}
                      />
                    }
                  />
                </MenuItem>
              ))}
            </FormGroup>
          </div>
          {props.applyButton && (
            <div style={{ padding: "8px", borderTop: "1px solid #eee" }}>
              <PrimaryButton
                variant="contained"
                style={classes.applyBtnStyle}
                onClick={() => {
                  const selectedAgentIds = localAgents
                    .filter((agent) => agent.checked)
                    .map((agent) => agent.id);
                  setAgents(localAgents.slice());
                  props?.onClickApply?.(selectedAgentIds);
                  setAnchorEl(null);
                }}
              >
                {t("productionFloor.apply")}
              </PrimaryButton>
            </div>
          )}
        </StyledMenu>
      </div>
    </div>
  );
};

export { AgentsList };
