import { matchSorter } from "match-sorter";
import { useGomakeAxios, useSnackBar } from "@/hooks";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getAndSetProperites } from "@/services/hooks/admin-side/profits/get-set-properites";
import { EHttpMethod } from "@/services/api-service/enums";
import { useOutputs } from "./use-outputs";
import { useParameters } from "./use-parameters";
import { IconButton } from "@mui/material";
import { MoreCircleIcon } from "@/icons";
import { useTranslation } from "react-i18next";
import { getAndSetMachincesByActionId } from "@/services/hooks";

const useProperites = ({ classes }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const tableHeaders = [
    t("properties.parameter"),
    t("properties.unit"),
    t("properties.rule"),
    t("properties.type"),
    t("properties.more"),
  ];
  const {
    alertSuccessDelete,
    alertFaultDelete,
    alertFaultUpdate,
    alertSuccessUpdate,
  } = useSnackBar();
  const [term, setTerm] = useState("");
  const { Outputs } = useOutputs();
  const { parameters } = useParameters();
  const [selectedProperties, setSelectedProperites] = useState();
  const [allProperties, setAllProperites] = useState([]);
  const [propertiesData, setProperitesData] = useState([]);
  const [propertiesDataSearched, setProperitesDataSearched] = useState([]);
  const [actionId, setActionId] = useState("");
  const { callApi } = useGomakeAxios();
  useEffect(() => {
    if (router.query.actionId) {
      getProperitesService();
      setActionId(router.query.actionId as string);
    }
  }, [router]);

  const getProperitesService = useCallback(async () => {
    await getAndSetProperites(callApi, setAllProperites, router);
  }, []);

  const [allMachincesList, setAllMachincesList] = useState<any>();
  const getMachincesByActionId = useCallback(async () => {
    if (router.query.actionId) {
      await getAndSetMachincesByActionId(callApi, setAllMachincesList, {
        actionId: router.query.actionId,
      });
    }
  }, [router]);
  useEffect(() => {
    getMachincesByActionId()
  }, [])
  useEffect(() => {
    const updatedProperties = updateProperties(
      allProperties,
      parameters,
      Outputs
    );
    const mapData = updatedProperties?.map((property) => [
      property.propertyName,
      property.defaultUnit || "-",
      <div style={classes.rowItem} className="scrollBlue">
        {property.actionRules
          ?.sort((a, b) => a.priority - b.priority)
          ?.map((rule, index) => {
            const successEvent =
              property?.propertyId === "9e8115f2-1ae9-4350-986e-a089af9183be"
                ? allMachincesList?.machines?.find(
                  (item) => item?.machineId === rule.successEvent
                )?.machineName
                : property?.ruleType === 1
                  ? (() => {
                    const params = parameters.find(
                      (param) => param?.id === property?.propertyId
                    )?.values;
                    const value = params?.find((value) => value?.id === rule.successEvent)?.name
                    return value;
                  })()
                  : rule.successEvent;
            return (
              <div style={classes.item}>
                {successEvent ? (
                  <>
                    {index + 1}- {rule.expression} value=
                    {successEvent}
                  </>
                ) : (
                  <>
                    {index + 1}- {rule.expression}
                  </>
                )}
              </div>
            );
          })}
      </div>,
      property.ruleType == 0 ? t("properties.output") : t("properties.input"),
      <IconButton
        onClick={(e) => {
          handleClick(e);
          setSelectedProperites(property);
        }}
      >
        <MoreCircleIcon />
      </IconButton>,
    ]);
    setProperitesData(mapData);
  }, [parameters, Outputs, allProperties, allMachincesList]);

  const [openAddRule, setOpenAddRule] = useState<boolean>(false);
  const [openEditRule, setOpenEditRule] = useState<boolean>(false);

  const onCloseAddRuleModal = () => {
    setOpenAddRule(false);
  };
  const onOpenAddRuleModal = () => {
    setOpenAddRule(true);
  };
  const onCOpenEditModal = () => {
    setOpenEditRule(true);
  };
  const onCloseEditModal = () => {
    setOpenEditRule(false);
  };
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const deleteRule = useCallback(
    async (propertyId: string, ruleType: number, id: string) => {
      const res = await callApi(
        EHttpMethod.PUT,
        `/v1/printhouse-config/print-house-action/delete-rule/${router.query.actionId}/${propertyId}/${ruleType}/${id}`
      );
      if (res?.success) {
        alertSuccessDelete();
        getProperitesService();
        onCloseEditModal();
      } else {
        alertFaultDelete();
      }
    },
    []
  );

  const reOrderPricingTables = useCallback(
    async (propertyId: string, ruleType: number, data: any) => {
      const res = await callApi(
        EHttpMethod.PUT,
        `/v1/printhouse-config/print-house-action/reorder-rule/${router.query.actionId}/${propertyId}/${ruleType}`,
        {
          data,
        }
      );
      if (res?.success) {
        alertSuccessUpdate();
        getProperitesService();
      } else {
        alertFaultUpdate();
      }
    },
    []
  );

  function updateProperties(allProperties, inputs, outputs) {
    allProperties.forEach((property) => {
      if (property.ruleType === 0) {
        // RuleType is 0, check for matching Output ID
        const matchingOutput = outputs.find(
          (output) => output.id === property.propertyId
        );
        if (matchingOutput) {
          property.defaultUnit = matchingOutput.defaultUnit;
        }
      } else if (property.ruleType === 1) {
        // RuleType is 1, check for matching Input ID
        const matchingInput = inputs.find(
          (input) => input.id === property.propertyId
        );
        if (matchingInput) {
          property.defaultUnit = matchingInput.defaultUnit;
        }
      }
    });

    return allProperties;
  }

  const filterArray = (array: any, searchText: string) =>
    array.filter((item) => {
      const matches = matchSorter([item[0]], searchText);
      return matches.length > 0;
    });

  useEffect(() => {
    if (propertiesData?.length) {
      const temp = filterArray(propertiesData, term);
      setProperitesDataSearched(temp);
    }
  }, [term]);
  return {
    allProperties,
    actionId,
    openAddRule,
    openEditRule,
    tableHeaders,
    router,
    anchorEl,
    open,
    selectedProperties,
    propertiesData,
    term,
    propertiesDataSearched,
    setTerm,
    onCloseAddRuleModal,
    onOpenAddRuleModal,
    onCOpenEditModal,
    onCloseEditModal,
    handleClick,
    handleClose,
    setSelectedProperites,
    getProperitesService,
    deleteRule,
    reOrderPricingTables,
  };
};

export { useProperites };
