import { ICallAndSetData } from "@/services/api-service/interface";
import { getSetApiData } from "@/services/api-service/get-set-api-data";
import { EHttpMethod } from "@/services/api-service/enums";

const PROFIT_AUTO_FIX_URL =
  "/v1/print-house-config/profits-auto-calculation/profit-auto-fix";
const ROLLBACK_UPDATED_PRICING_TABLES_AFTER_OPTIMIZATION_URL =
  "/v1/print-house-config/profits-auto-calculation/rollback-updated-pricing-tables-after-optimization";

const profitAutoFixApi: ICallAndSetData = async (callApi, setState, data) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    PROFIT_AUTO_FIX_URL,
    setState,
    data
  );
};

const rollbackUpdatedPricingTablesAfterOptimizationApi: ICallAndSetData =
  async (callApi, setState) => {
    return await getSetApiData(
      callApi,
      EHttpMethod.GET,
      ROLLBACK_UPDATED_PRICING_TABLES_AFTER_OPTIMIZATION_URL,
      setState
    );
  };

export { profitAutoFixApi, rollbackUpdatedPricingTablesAfterOptimizationApi };
