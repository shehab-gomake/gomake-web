import { matchSorter } from "match-sorter";
import { useGomakeAxios, useSnackBar } from "@/hooks";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getAndSetProperites } from "@/services/hooks/admin-side/profits/get-set-properites";
import { EHttpMethod } from "@/services/api-service/enums";
import { useOutputs } from "./use-outputs";
import { useParameters } from "./use-parameters";
import { IconButton, TextField } from "@mui/material";
import { MoreCircleIcon } from "@/icons";
import { useTranslation } from "react-i18next";
import { getAndSetMachincesByActionId } from "@/services/hooks";
import { EValueType } from "@/pages-components/products/profits-new/enums/profites-enum";
import { useRecoilState } from "recoil";
import { actionEmployeesState } from "@/store/action-employees-state";
import { UpdateValueInput } from "@/components/text-input/update-value-input";

const useProperites = ({ classes }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const tableHeaders = [
    "",
    t("properties.parameter"),
    t("properties.unit"),
    t("properties.defaultOption"),
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
  const [selectedProperties, setSelectedProperites] = useState<any>();
  const [allProperties, setAllProperites] = useState([]);
  const [propertiesData, setProperitesData] = useState([]);
  const [hiddenData, setHiddenData] = useState([]);
  const [propertiesDataSearched, setProperitesDataSearched] = useState([]);
  const [actionId, setActionId] = useState("");
  const [actionEmployeeList, setActionEmployeeList] = useRecoilState<any>(actionEmployeesState)
  const [editingDefaultValue, setEditingDefaultValue] = useState<{ propertyId: string; ruleType: number } | null>(null);
  const [defaultValueInput, setDefaultValueInput] = useState<string>("");

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
  const updatePropertyDefaultValue = useCallback(
    async (data: any) => {
      const res = await callApi(
        EHttpMethod.PUT,
        `/v1/printhouse-config/print-house-action/update-property-default-value`,
        {
          actionId: data.actionId,
          propertyId: data.propertyId,
          defaultValue: data.defaultValue,
          ruleType: data.ruleType,
        }
      );
      if (res?.success) {
        alertSuccessUpdate();
        getProperitesService();
      } else {
        alertFaultUpdate();
      }
    },
    [callApi, alertSuccessUpdate, alertFaultUpdate, getProperitesService]
  );

  const getSuccessEvent = (property, rule) => {
    if (property?.ruleType === 1) {
      const params = parameters.find(
        (param) => param?.id === property?.propertyId
      )?.values;
      return params?.find((value) => value?.id === rule.successEvent)?.name
    }
    switch (property?.valueType) {
      case EValueType.MATERIAL:
        const params = parameters.find(
          (param) => param?.id === property?.propertyId
        )?.values;
        return params?.find((value) => value?.id === rule.successEvent)?.name
      case EValueType.MACHINE:
        return allMachincesList?.machines?.find(
          (item) => item?.machineId === rule.successEvent
        )?.machineName
      case EValueType.EMPLOYEE:
        return actionEmployeeList.find(
          (item) => item?.id === rule.successEvent
        )?.label
      default:
        return rule.successEvent;
    }
  }
  useEffect(() => {
    const updatedProperties = updateProperties(
      allProperties,
      parameters,
      Outputs
    );
    const mapData = updatedProperties?.map((property, index) => {
      const isEditing = editingDefaultValue?.propertyId === property.propertyId && editingDefaultValue?.ruleType === property.ruleType;
      const currentDefaultValue = property.defaultValue || "";

      return [
        property.propertyName,
        property.defaultUnit || "-",
        isEditing ? (
          <UpdateValueInput
            value={defaultValueInput}
            onInputChange={(value) => setDefaultValueInput(value)}
            onUpdate={async () => {
              if (defaultValueInput !== currentDefaultValue) {
                await updatePropertyDefaultValue({
                  actionId: router.query.actionId as string,
                  propertyId: property.propertyId,
                  defaultValue: defaultValueInput,
                  ruleType: property.ruleType,
                });
              }
              setEditingDefaultValue(null);
              setDefaultValueInput("");
            }}
            onCancel={() => {
              setEditingDefaultValue(null);
              setDefaultValueInput("");
            }}
            clickedOut={async () => {
              if (defaultValueInput !== currentDefaultValue) {
                await updatePropertyDefaultValue({
                  actionId: router.query.actionId as string,
                  propertyId: property.propertyId,
                  defaultValue: defaultValueInput,
                  ruleType: property.ruleType,
                });
              }
              setEditingDefaultValue(null);
              setDefaultValueInput("");
            }}
          />
        ) : (
          <div
            onClick={() => {
              setEditingDefaultValue({ propertyId: property.propertyId, ruleType: property.ruleType });
              setDefaultValueInput(currentDefaultValue);
            }}
            style={{ cursor: "pointer", padding: "4px", minHeight: "26px", display: "flex", alignItems: "center" }}
          >
            {currentDefaultValue || "-"}
          </div>
        ),
        <div style={classes.rowItem} className="scrollBlue">
          {property.actionRules
            ?.sort((a, b) => a.priority - b.priority)
            ?.map((rule, index) => {
              const successEvent = getSuccessEvent(property, rule)
              return (
                <div style={classes.item}>
                  {successEvent ? (
                    <>
                      {index + 1}- {rule.expression} {t("products.profits.exceptions.value")} =
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
      ];
    });
    setProperitesData(mapData);
    const hiddenData = updatedProperties?.map((property, index) => ({
      propertyId: property.propertyId,
      ruleType: property.ruleType,
      index: index
    }));

    setHiddenData(hiddenData);
  }, [parameters, Outputs, allProperties, allMachincesList, editingDefaultValue, defaultValueInput, updatePropertyDefaultValue, router.query.actionId, classes.rowItem, classes.item, t, actionEmployeeList]);

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


  const reOrderPropertiesTables = useCallback(
    async (data: any) => {
      const res = await callApi(
        EHttpMethod.PUT,
        `/v1/printhouse-config/print-house-action/update-action-properties/${router.query.actionId}`,
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

  const updateIsHiddenFromWorkFlow = useCallback(async () => {
    const res = await callApi(
      EHttpMethod.PUT,
      `/v1/printhouse-config/print-house-action/toggle-is-hidden-from-work-flow/${router.query.actionId}/${selectedProperties?.ruleType}/${selectedProperties?.propertyId}`,
    );
    if (res?.success) {
      alertSuccessUpdate();
      getProperitesService();
    } else {
      alertFaultUpdate();
    }
  },
    [selectedProperties]
  );

  const updateIsHiddenFromCalculation = useCallback(async () => {
    const res = await callApi(
      EHttpMethod.PUT,
      `/v1/printhouse-config/print-house-action/toggle-is-hidden-from-calculation/${router.query.actionId}/${selectedProperties?.ruleType}/${selectedProperties?.propertyId}`,
    );
    if (res?.success) {
      alertSuccessUpdate();
      getProperitesService();
    } else {
      alertFaultUpdate();
    }
  },
    [selectedProperties]
  );

  const ToggleIsShowInOutSourceDetails = useCallback(async () => {
    const res = await callApi(
      EHttpMethod.PUT,
      `/v1/printhouse-config/print-house-action/toggle-is-show-in-out-source-details/${router.query.actionId}/${selectedProperties?.ruleType}/${selectedProperties?.propertyId}`,
    );
    if (res?.success) {
      alertSuccessUpdate();
      getProperitesService();
    } else {
      alertFaultUpdate();
    }


  }, [selectedProperties]);

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
      } else if (property?.ruleType === 1) {
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
    setProperitesData,
    hiddenData,
    setHiddenData,
    reOrderPropertiesTables,
    updateIsHiddenFromWorkFlow,
    updateIsHiddenFromCalculation,
    ToggleIsShowInOutSourceDetails,
    updatePropertyDefaultValue,
    parameters
  };
};


export { useProperites };
