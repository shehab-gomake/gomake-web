import { useGomakeAxios, useSnackBar } from "@/hooks";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getAndSetProperites } from "@/services/hooks/admin-side/profits/get-set-properites";
import { EHttpMethod } from "@/services/api-service/enums";
import { useOutputs } from "./use-outputs";
import { useParameters } from "./use-parameters";

const useProperites = () => {
  const router = useRouter();
  const {
    alertSuccessDelete,
    alertFaultDelete,
    alertFaultUpdate,
    alertSuccessUpdate,
  } = useSnackBar();
  const { Outputs } = useOutputs();
  const { parameters } = useParameters();
  const [selectedProperties, setSelectedProperites] = useState();
  const [allProperties, setAllProperites] = useState([]);
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
  const [filter, setFilter] = useState<string>("");
  const properties = useCallback(() => {
    if (!!filter) {
      return allProperties?.filter((property) =>
        property.propertyName.toLowerCase().includes(filter.toLowerCase())
      );
    }
    const updatedProperties = updateProperties(
      allProperties,
      parameters,
      Outputs
    );
    return updatedProperties;
  }, [filter, allProperties, parameters, Outputs]);

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
  return {
    allProperties,
    actionId,
    openAddRule,
    openEditRule,
    onCloseAddRuleModal,
    onOpenAddRuleModal,
    onCOpenEditModal,
    onCloseEditModal,
    anchorEl,
    open,
    handleClick,
    handleClose,
    selectedProperties,
    setSelectedProperites,
    properties,
    setFilter,
    getProperitesService,
    deleteRule,
    reOrderPricingTables,
  };
};

export { useProperites };
