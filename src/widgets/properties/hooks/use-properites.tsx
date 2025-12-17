import { matchSorter } from "match-sorter";
import { useGomakeAxios, useSnackBar } from "@/hooks";
import { useCallback, useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import { getAndSetProperites } from "@/services/hooks/admin-side/profits/get-set-properites";
import { EHttpMethod } from "@/services/api-service/enums";
import { useOutputs } from "./use-outputs";
import { useParameters } from "./use-parameters";
import { IconButton, Skeleton } from "@mui/material";
import { MoreCircleIcon } from "@/icons";
import { useTranslation } from "react-i18next";
import { getAndSetMachincesByActionId } from "@/services/hooks";
import { EValueType } from "@/pages-components/products/profits-new/enums/profites-enum";
import { useRecoilState } from "recoil";
import { actionEmployeesState } from "@/store/action-employees-state";
import { UpdateValueInput } from "@/components/text-input/update-value-input";
import { GoMakeAutoComplate, GomakeTextInput } from "@/components";
import { EParameterTypes } from "@/enums";
import { ClickOutside } from "@/components/click-out-side/click-out-side";

const useProperites = ({ classes }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const isMountedRef = useRef(true);
  const tableHeaders = [
    "",
    t("properties.properties"),
    t("properties.defaultOption"),
    t("properties.unit"),
    t("properties.type"),
    t("properties.rule"),
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

  // Track if component is still mounted and on properties page
  useEffect(() => {
    isMountedRef.current = router.pathname === '/properties';

    // Listen for route changes to immediately stop effects
    const handleRouteChangeStart = () => {
      isMountedRef.current = false;
    };

    const handleRouteChangeComplete = () => {
      isMountedRef.current = router.pathname === '/properties';
    };

    router.events.on('routeChangeStart', handleRouteChangeStart);
    router.events.on('routeChangeComplete', handleRouteChangeComplete);

    return () => {
      isMountedRef.current = false;
      router.events.off('routeChangeStart', handleRouteChangeStart);
      router.events.off('routeChangeComplete', handleRouteChangeComplete);
    };
  }, [router.pathname, router.events]);

  const getProperitesService = useCallback(async () => {
    if (router.query.actionId) {
      await getAndSetProperites(callApi, setAllProperites, router);
    }
  }, [callApi, router.query.actionId]);

  useEffect(() => {
    // Only run when router is ready, we're on the properties page, and we have an actionId
    // This prevents running during navigation away from the page
    if (!isMountedRef.current) return;
    const isPropertiesPage = router.pathname === '/properties';
    if (router.isReady && isPropertiesPage && router.query.actionId) {
      getProperitesService();
      setActionId(router.query.actionId as string);
    }
  }, [router.pathname, router.query.actionId, router.isReady, getProperitesService]);

  const [allMachincesList, setAllMachincesList] = useState<any>();
  const getMachincesByActionId = useCallback(async () => {
    if (router.query.actionId) {
      await getAndSetMachincesByActionId(callApi, setAllMachincesList, {
        actionId: router.query.actionId,
      });
    }
  }, [callApi, router.query.actionId]);

  useEffect(() => {
    // Only run when router is ready, we're on the properties page, and we have an actionId
    // This prevents running during navigation away from the page
    if (!isMountedRef.current) return;
    const isPropertiesPage = router.pathname === '/properties';
    if (router.isReady && isPropertiesPage && router.query.actionId) {
      getMachincesByActionId()
    }
  }, [router.pathname, router.query.actionId, router.isReady, getMachincesByActionId])
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

  const isValueLoading = (property: any, defaultValue: string): boolean => {
    // Check if value is a UUID (needs resolution)
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(defaultValue);
    if (!isUUID) {
      return false; // Not a UUID, no loading needed
    }

    const selectedOutput = Outputs?.find(
      (output) => output?.id === property?.propertyId
    );
    const selectedParameter = parameters?.find(
      (parameter) => parameter?.id === property?.propertyId
    );

    if (property?.ruleType === 0) {
      // Output - check if data is loaded
      switch (selectedOutput?.valueType) {
        case EValueType.MACHINE:
          const machinesLoaded = router.query.actionId
            ? allMachincesList?.machines?.length > 0
            : allMachincesList?.length > 0;
          return !machinesLoaded;
        case EValueType.MATERIAL:
          return !parameters || parameters.length === 0;
        case EValueType.EMPLOYEE:
          return !actionEmployeeList || actionEmployeeList.length === 0;
        default:
          return false;
      }
    } else {
      // Input - check if parameters are loaded
      return !parameters || parameters.length === 0;
    }
  };

  const getDefaultValueDisplay = (property: any, defaultValue: string) => {
    if (!defaultValue || defaultValue === "-") {
      return defaultValue || t("products.profits.exceptions.selectValue");
    }

    const selectedOutput = Outputs?.find(
      (output) => output?.id === property?.propertyId
    );
    const selectedParameter = parameters?.find(
      (parameter) => parameter?.id === property?.propertyId
    );

    if (property?.ruleType === 0) {
      // Output - use valueType from Outputs
      switch (selectedOutput?.valueType) {
        case EValueType.MACHINE:
          const machine = router.query.actionId
            ? allMachincesList?.machines?.find(
              (m) => String(m.machineId) === String(defaultValue)
            )
            : allMachincesList?.find(
              (m) => String(m.id) === String(defaultValue)
            );
          return machine?.machineName || machine?.nickName || defaultValue;
        case EValueType.MATERIAL:
          const materialParams = parameters.find(
            (param) => param?.id === property?.propertyId
          )?.values;
          const material = materialParams?.find(
            (m) =>
              String(m.materialTypeKey || m.id) === String(defaultValue)
          );
          return material?.materialTypeName || material?.name || defaultValue;
        case EValueType.EMPLOYEE:
          const employee = actionEmployeeList.find(
            (e) => String(e.id) === String(defaultValue)
          );
          return employee?.label || defaultValue;
        case EValueType.BOOLEAN:
          return defaultValue === "true"
            ? t("modal.yes")
            : defaultValue === "false"
              ? t("modal.no")
              : defaultValue;
        case EValueType.INPUTNUMBER:
        case EValueType.INPUTTEXT:
          return defaultValue;
        default:
          return defaultValue;
      }
    } else {
      // Input - use type from Parameters
      switch (selectedParameter?.type) {
        case EParameterTypes.DROP_DOWN_LIST:
        case EParameterTypes.SELECT_MATERIALS:
          const paramValue = selectedParameter?.values?.find(
            (v) => String(v.id) === String(defaultValue)
          );
          return paramValue?.name || defaultValue;
        case EParameterTypes.SWITCH:
          return defaultValue === "true"
            ? t("modal.yes")
            : defaultValue === "false"
              ? t("modal.no")
              : defaultValue;
        case EParameterTypes.INPUT_NUMBER:
        case EParameterTypes.INPUT_TEXT:
          return defaultValue;
        default:
          return defaultValue;
      }
    }
  }

  const renderDefaultValueInput = (property: any, onSave: (value?: string) => void) => {
    const selectedOutput = Outputs?.find(
      (output) => output?.id === property?.propertyId
    );
    const selectedParameter = parameters?.find(
      (parameter) => parameter?.id === property?.propertyId
    );

    if (property?.ruleType === 0) {
      // Output - use valueType from Outputs
      switch (selectedOutput?.valueType) {
        case EValueType.MACHINE:
          return (
            <GoMakeAutoComplate
              options={
                router.query.actionId
                  ? allMachincesList?.machines?.map((value) => ({
                    ...value,
                    label: value?.machineName,
                    id: value.machineId,
                  }))
                  : allMachincesList?.map((value) => ({
                    ...value,
                    label: `${value?.nickName}`,
                    id: value.id,
                  }))
              }
              placeholder={t("products.profits.exceptions.selectMachine")}
              value={
                defaultValueInput
                  ? router.query.actionId
                    ? allMachincesList?.machines?.find(
                      (m) => String(m.machineId) === String(defaultValueInput)
                    )
                      ? {
                        ...allMachincesList?.machines?.find(
                          (m) => String(m.machineId) === String(defaultValueInput)
                        ),
                        label: allMachincesList?.machines?.find(
                          (m) => String(m.machineId) === String(defaultValueInput)
                        )?.machineName,
                        id: String(defaultValueInput),
                      }
                      : null
                    : allMachincesList?.find((m) => String(m.id) === String(defaultValueInput))
                      ? {
                        ...allMachincesList?.find((m) => String(m.id) === String(defaultValueInput)),
                        label: `${allMachincesList?.find((m) => String(m.id) === String(defaultValueInput))?.nickName}`,
                        id: String(defaultValueInput),
                      }
                      : null
                  : null
              }
              onChange={(e, value) => {
                const newValue = String(value?.id || value?.machineId || "");
                setDefaultValueInput(newValue);
                onSave(newValue);
              }}
              style={{
                width: "100%",
                border: "1px solid #e0e0e0",
                background: "#fff",
                borderRadius: 4,
                maxWidth: 180,
                minWidth: 180,
              }}
            />
          );
        case EValueType.MATERIAL:
          const materialParams = parameters.find(
            (param) => param?.id === property?.propertyId
          )?.values;
          return (
            <GoMakeAutoComplate
              options={materialParams?.map((value) => ({
                ...value,
                label: value.materialTypeName || value.name,
                id: value.materialTypeKey || value.id,
              }))}
              placeholder={"Select Material"}
              value={
                defaultValueInput
                  ? materialParams?.find(
                    (m) =>
                      String(m.materialTypeKey || m.id) === String(defaultValueInput)
                  )
                    ? {
                      ...materialParams?.find(
                        (m) =>
                          String(m.materialTypeKey || m.id) === String(defaultValueInput)
                      ),
                      label:
                        materialParams?.find(
                          (m) =>
                            String(m.materialTypeKey || m.id) === String(defaultValueInput)
                        )?.materialTypeName ||
                        materialParams?.find(
                          (m) =>
                            String(m.materialTypeKey || m.id) === String(defaultValueInput)
                        )?.name,
                      id: String(defaultValueInput),
                    }
                    : null
                  : null
              }
              onChange={(e: any, value: any) => {
                const newValue = String(value?.id || value?.materialTypeKey || "");
                setDefaultValueInput(newValue);
                onSave(newValue);
              }}
              style={{
                width: "100%",
                border: "1px solid #e0e0e0",
                background: "#fff",
                borderRadius: 4,
                maxWidth: 180,
                minWidth: 180,
              }}
            />
          );
        case EValueType.INPUTNUMBER:
          return (
            <GomakeTextInput
              type="number"
              placeholder={t("products.profits.exceptions.enterValue")}
              value={defaultValueInput}
              onChange={(e: any) => {
                setDefaultValueInput(e.target.value);
              }}
              onBlur={(e: any) => {
                onSave(e.target.value);
              }}
              style={{
                width: "100%",
                border: "1px solid #e0e0e0",
                background: "#fff",
                borderRadius: 4,
                height: 40,
                maxWidth: 180,
                minWidth: 180,
              }}
            />
          );
        case EValueType.INPUTTEXT:
          return (
            <GomakeTextInput
              placeholder={t("products.profits.exceptions.enterValue")}
              value={defaultValueInput}
              onChange={(e: any) => {
                setDefaultValueInput(e.target.value);
              }}
              onBlur={(e: any) => {
                onSave(e.target.value);
              }}
              style={{
                width: "100%",
                border: "1px solid #e0e0e0",
                background: "#fff",
                borderRadius: 4,
                height: 40,
                minWidth: 180,
              }}
            />
          );
        case EValueType.BOOLEAN:
          return (
            <GoMakeAutoComplate
              options={[
                { label: t("modal.yes"), value: "true" },
                { label: t("modal.no"), value: "false" },
              ]}
              placeholder={t("products.profits.exceptions.selectValue")}
              disableClearable={false}
              value={
                defaultValueInput
                  ? defaultValueInput === "true"
                    ? { label: t("modal.yes"), value: "true" }
                    : defaultValueInput === "false"
                      ? { label: t("modal.no"), value: "false" }
                      : null
                  : null
              }
              onChange={(e: any, value: any) => {
                const newValue = value === null || value === undefined ? "" : (value?.value as string || "");
                setDefaultValueInput(newValue);
                onSave(newValue);
              }}
              style={{
                width: "100%",
                border: "1px solid #e0e0e0",
                background: "#fff",
                borderRadius: 4,
                maxWidth: 180,
                minWidth: 180,
              }}
            />
          );
        case EValueType.EMPLOYEE:
          return (
            <GoMakeAutoComplate
              options={actionEmployeeList}
              placeholder={t("products.profits.exceptions.selectEmployee")}
              value={
                defaultValueInput
                  ? actionEmployeeList.find((e) => String(e.id) === String(defaultValueInput))
                  : null
              }
              onChange={(e, value) => {
                const newValue = String(value?.id || "");
                setDefaultValueInput(newValue);
                onSave(newValue);
              }}
              style={{
                width: "100%",
                border: "1px solid #e0e0e0",
                background: "#fff",
                borderRadius: 4,
                maxWidth: 180,
                minWidth: 180,
              }}
            />
          );
        default:
          return (
            <></>
            // <UpdateValueInput
            //   value={defaultValueInput}
            //   onInputChange={(value) => setDefaultValueInput(value)}
            //   onUpdate={async () => {
            //     if (defaultValueInput !== (property.defaultValue || "")) {
            //       await updatePropertyDefaultValue({
            //         actionId: router.query.actionId as string,
            //         propertyId: property.propertyId,
            //         defaultValue: defaultValueInput,
            //         ruleType: property.ruleType,
            //       });
            //     }
            //     setEditingDefaultValue(null);
            //     setDefaultValueInput("");
            //   }}
            //   onCancel={() => {
            //     setEditingDefaultValue(null);
            //     setDefaultValueInput("");
            //   }}
            //   clickedOut={async () => {
            //     if (defaultValueInput !== (property.defaultValue || "")) {
            //       await updatePropertyDefaultValue({
            //         actionId: router.query.actionId as string,
            //         propertyId: property.propertyId,
            //         defaultValue: defaultValueInput,
            //         ruleType: property.ruleType,
            //       });
            //     }
            //     setEditingDefaultValue(null);
            //     setDefaultValueInput("");
            //   }}
            // />
          );
      }
    } else {
      // Input - use type from Parameters
      switch (selectedParameter?.type) {
        case EParameterTypes.DROP_DOWN_LIST:
          return (
            <GoMakeAutoComplate
              options={selectedParameter?.values?.map((value) => ({
                ...value,
                label: value.name,
                id: value.id,
              }))}
              placeholder={t("products.profits.exceptions.selectValue")}
              value={
                defaultValueInput
                  ? selectedParameter?.values?.find(
                    (v) => String(v.id) === String(defaultValueInput)
                  )
                    ? {
                      ...selectedParameter?.values?.find(
                        (v) => String(v.id) === String(defaultValueInput)
                      ),
                      label: selectedParameter?.values?.find(
                        (v) => String(v.id) === String(defaultValueInput)
                      )?.name,
                      id: String(defaultValueInput),
                    }
                    : null
                  : null
              }
              onChange={(e, value) => {
                const newValue = String(value?.id || "");
                setDefaultValueInput(newValue);
                onSave(newValue);
              }}
              style={{
                width: "100%",
                border: "1px solid #e0e0e0",
                background: "#fff",
                borderRadius: 4,
                maxWidth: 180,
              }}
            />
          );
        case EParameterTypes.INPUT_NUMBER:
          return (
            <GomakeTextInput
              type="number"
              placeholder={t("products.profits.exceptions.enterValue")}
              value={defaultValueInput}
              onChange={(e: any) => {
                setDefaultValueInput(e.target.value);
              }}
              onBlur={(e: any) => {
                onSave(e.target.value);
              }}
              style={{
                width: "100%",
                border: "1px solid #e0e0e0",
                background: "#fff",
                borderRadius: 4,
                height: 40,
                maxWidth: 180,
              }}
            />
          );
        case EParameterTypes.INPUT_TEXT:
          return (
            <GomakeTextInput
              placeholder={t("products.profits.exceptions.enterValue")}
              value={defaultValueInput}
              onChange={(e: any) => {
                setDefaultValueInput(e.target.value);
              }}
              onBlur={(e: any) => {
                onSave(e.target.value);
              }}
              style={{
                width: "100%",
                border: "1px solid #e0e0e0",
                background: "#fff",
                borderRadius: 4,
                height: 40,
                maxWidth: 180,
                minWidth: 180,
              }}
            />
          );
        case EParameterTypes.SWITCH:
          return (
            <GoMakeAutoComplate
              options={[
                { label: t("modal.yes"), value: "true" },
                { label: t("modal.no"), value: "false" },
              ]}
              placeholder={t("products.profits.exceptions.selectValue")}
              disableClearable={false}
              value={
                defaultValueInput
                  ? defaultValueInput === "true"
                    ? { label: t("modal.yes"), value: "true" }
                    : defaultValueInput === "false"
                      ? { label: t("modal.no"), value: "false" }
                      : null
                  : null
              }
              onChange={(e: any, value: any) => {
                const newValue = value === null || value === undefined ? "" : (value?.value as string || "");
                setDefaultValueInput(newValue);
                onSave(newValue);
              }}
              style={{
                width: "100%",
                border: "1px solid #e0e0e0",
                background: "#fff",
                borderRadius: 4,
                maxWidth: 180,
                minWidth: 180,
              }}
            />
          );
        case EParameterTypes.SELECT_MATERIALS:
          return (
            <GoMakeAutoComplate
              options={selectedParameter?.values?.map((value) => ({
                ...value,
                label: value.name,
                id: value.id,
              }))}
              placeholder={t("products.profits.exceptions.selectValue")}
              value={
                defaultValueInput
                  ? selectedParameter?.values?.find(
                    (v) => String(v.id) === String(defaultValueInput)
                  )
                    ? {
                      ...selectedParameter?.values?.find(
                        (v) => String(v.id) === String(defaultValueInput)
                      ),
                      label: selectedParameter?.values?.find(
                        (v) => String(v.id) === String(defaultValueInput)
                      )?.name,
                      id: String(defaultValueInput),
                    }
                    : null
                  : null
              }
              onChange={(e, value) => {
                const newValue = String(value?.id || "");
                setDefaultValueInput(newValue);
                onSave(newValue);
              }}
              style={{
                width: "100%",
                border: "1px solid #e0e0e0",
                background: "#fff",
                borderRadius: 4,
                maxWidth: 180,
                minWidth: 180,
              }}
            />
          );
        default:
          return (
            <></>
            // <UpdateValueInput
            //   value={defaultValueInput}
            //   onInputChange={(value) => setDefaultValueInput(value)}
            //   onUpdate={async () => {
            //     if (defaultValueInput !== (property.defaultValue || "")) {
            //       await updatePropertyDefaultValue({
            //         actionId: router.query.actionId as string,
            //         propertyId: property.propertyId,
            //         defaultValue: defaultValueInput,
            //         ruleType: property.ruleType,
            //       });
            //     }
            //     setEditingDefaultValue(null);
            //     setDefaultValueInput("");
            //   }}
            //   onCancel={() => {
            //     setEditingDefaultValue(null);
            //     setDefaultValueInput("");
            //   }}
            //   clickedOut={async () => {
            //     if (defaultValueInput !== (property.defaultValue || "")) {
            //       await updatePropertyDefaultValue({
            //         actionId: router.query.actionId as string,
            //         propertyId: property.propertyId,
            //         defaultValue: defaultValueInput,
            //         ruleType: property.ruleType,
            //       });
            //     }
            //     setEditingDefaultValue(null);
            //     setDefaultValueInput("");
            //   }}
            // />
          );
      }
    }
  };
  useEffect(() => {
    // Only run this effect when we're on the properties page
    // This prevents the heavy JSX creation from blocking navigation
    if (!isMountedRef.current) return;
    const isPropertiesPage = router.pathname === '/properties';
    if (!isPropertiesPage) {
      return;
    }

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
        isEditing ? (
          <ClickOutside
            onClick={async () => {
              const valueToSave = defaultValueInput;
              if (valueToSave !== currentDefaultValue) {
                await updatePropertyDefaultValue({
                  actionId: router.query.actionId as string,
                  propertyId: property.propertyId,
                  defaultValue: valueToSave,
                  ruleType: property.ruleType,
                });
              }
              setEditingDefaultValue(null);
              setDefaultValueInput("");
            }}
            style={{ width: "100%" }}
          >
            <div style={{ width: 180 }}>
              {renderDefaultValueInput(property, async (value?: string) => {
                const valueToSave = value !== undefined ? value : defaultValueInput;
                if (valueToSave !== currentDefaultValue) {
                  try {
                    await updatePropertyDefaultValue({
                      actionId: router.query.actionId as string,
                      propertyId: property.propertyId,
                      defaultValue: valueToSave,
                      ruleType: property.ruleType,
                    });
                    // Close editing mode after successful save
                    setEditingDefaultValue(null);
                    setDefaultValueInput("");
                  } catch (error) {
                    console.error('Error updating property default value:', error);
                    // Keep editing mode open on error
                  }
                } else {
                  // If value hasn't changed, just close editing mode
                  setEditingDefaultValue(null);
                  setDefaultValueInput("");
                }
              })}
            </div>
          </ClickOutside>
        ) : (
          <div
            onClick={() => {
              setEditingDefaultValue({ propertyId: property.propertyId, ruleType: property.ruleType });
              setDefaultValueInput(currentDefaultValue);
            }}
            style={{
              cursor: "pointer",
              padding: "4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid #e0e0e0",
              background: "#fff",
              borderRadius: 4,
              maxWidth: 180,
              minWidth: 180,
              minHeight: 38,
            }}
          >
            {isValueLoading(property, currentDefaultValue) ? (
              <Skeleton
                variant="text"
                width="80%"
                height={40}
                sx={{
                  mx: "auto",
                }}
              />
            ) : (
              getDefaultValueDisplay(property, currentDefaultValue)
            )}
          </div>
        ),
        property.defaultUnit || "-",
        property.ruleType == 0 ? t("properties.output") : t("properties.input"),
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

    // Only update state if still on properties page
    if (isMountedRef.current && router.pathname === '/properties') {
      setProperitesData(mapData);
      const hiddenData = updatedProperties?.map((property, index) => ({
        propertyId: property.propertyId,
        ruleType: property.ruleType,
        index: index
      }));
      setHiddenData(hiddenData);
    }
  }, [parameters, Outputs, allProperties, allMachincesList, editingDefaultValue, defaultValueInput, updatePropertyDefaultValue, router.query.actionId, router.pathname, classes.rowItem, classes.item, t, actionEmployeeList]);

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
    if (term && term.trim()) {
      if (propertiesData?.length) {
        const temp = filterArray(propertiesData, term);
        setProperitesDataSearched(temp);
      } else {
        setProperitesDataSearched([]);
      }
    } else {
      // When no search term, keep searched data in sync with main data
      setProperitesDataSearched(propertiesData || []);
    }
  }, [term, propertiesData]);
  const columnWidths = [
    "5%",      // Empty (replaced by drag handle)
    "20%",       // Parameter
    "10%",       // Default Option (wider)
    "10%",        // Unit
    "10%",       // Type
    "40%",       // Rule (smaller)
    "5%",        // More
  ];

  return {
    allProperties,
    actionId,
    openAddRule,
    openEditRule,
    tableHeaders,
    columnWidths,
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
