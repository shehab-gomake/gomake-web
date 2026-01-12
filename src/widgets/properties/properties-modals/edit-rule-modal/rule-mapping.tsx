import { DeleteMenuIcon } from "@/pages/admin/products/parameters/widget/more-circle/icons/delete-menu";
import { ReOrderIcon } from "@/icons";
import { useStyle } from "./style";
import { SettingIcon } from "@/widgets/shared-admin-customers";
import { EProductProfits } from "@/widgets/shared-admin-customers/add-product/settings/settings-data";
import { useTranslation } from "react-i18next";
import { EValueType } from "@/pages-components/products/profits-new/enums/profites-enum";
import { useParameters } from "../../hooks/use-parameters";
import { getAndSetMachincesByActionId } from "@/services/hooks/admin-side/profits/get-set-machinces-by-action-id";
import { useCallback } from "react";
import { useEffect, useState } from "react";
import { useGomakeAxios } from "@/hooks";
import { useRouter } from "next/router";
import { actionEmployeesState } from "@/store/action-employees-state";
import { useRecoilValue } from "recoil";

interface RuleMappingWidgetProps {
  rule: any;
  deletePropertyRule: (id: string) => void;
  productId?: string;
  selectedProperties?: any;
}

const RuleMappingWidget = ({
  rule,
  deletePropertyRule,
  productId,
  selectedProperties,
}: RuleMappingWidgetProps) => {
  const { classes } = useStyle();
  const { t } = useTranslation();
  const { parameters } = useParameters();
  const { callApi } = useGomakeAxios();
  const router = useRouter();
  const actionEmployeeList = useRecoilValue<any>(actionEmployeesState);

  const [allMachincesList, setAllMachincesList] = useState<any>();
  const getMachincesByActionId = useCallback(async () => {
    if (router.query.actionId) {
      await getAndSetMachincesByActionId(callApi, setAllMachincesList, {
        actionId: router.query.actionId,
      });
    }
  }, [router]);
  useEffect(() => {
    getMachincesByActionId();
  }, []);
  const getSuccessEvent = (property, rule) => {
    if (property?.ruleType === 1) {
      const params = parameters.find(
        (param) => param?.id === property?.propertyId
      )?.values;
      return params?.find((value) => value?.id === rule.successEvent)?.name;
    }
    switch (property?.valueType) {
      case EValueType.MATERIAL:
        const params = parameters.find(
          (param) => param?.id === property?.propertyId
        )?.values;
        return params?.find((value) => value?.id === rule.successEvent)?.name;
      case EValueType.MACHINE:
        return allMachincesList?.machines?.find(
          (item) => item?.machineId === rule.successEvent
        )?.machineName;
      case EValueType.EMPLOYEE:
        return actionEmployeeList.find((item) => item?.id === rule.successEvent)
          ?.label;
      default:
        return rule.successEvent;
    }
  };
  return (
    <div style={classes.mainContainerStyle}>
      <div>
        <ReOrderIcon />
      </div>
      <div style={classes.lineStyle}>
        <div>
          {rule.expression}{" "}
          <span>
            {t("products.profits.exceptions.value")} ={" "}
            {getSuccessEvent(selectedProperties, rule)}
          </span>
        </div>
        <div style={classes.iconsContainer}>
          {rule?.profitsModel === EProductProfits.BY_PRODUCT && (
            <div
              style={classes.deleteBtn}
              onClick={() =>
                window.open(
                  `/products/profits?productId=${productId}`,
                  "_blank"
                )
              }
            >
              <SettingIcon width={"16"} height={"16"} />
            </div>
          )}
          <div
            style={classes.deleteBtn}
            onClick={() => {
              deletePropertyRule(rule.id);
            }}
          >
            {" "}
            <DeleteMenuIcon />
          </div>
        </div>
      </div>
    </div>
  );
};
export { RuleMappingWidget };
