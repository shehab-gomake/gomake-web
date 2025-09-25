import { useState, useEffect } from "react";
import { useGomakeAxios } from "@/hooks";
import { getMaterialTableHeadersApi } from "@/services/api-service/materials/materials-endpoints";
import { useRecoilValue } from "recoil";
import { userState } from "@/store";
import { UNIT_TYPE } from "@/enums";
import { convertTitleUnits } from "@/utils/helpers";

interface MaterialTableHeader {
  key: string;
  value: string;
  unit: string | null;
  isFilter: boolean;
  isForAdd?: boolean;
  isForAdmin?: boolean;
}

export const useMaterialTableHeaders = (materialKey: string) => {
  const { callApi } = useGomakeAxios();
  const [headers, setHeaders] = useState<MaterialTableHeader[]>([]);
  const [loading, setLoading] = useState(false);
  const user = useRecoilValue(userState);
  const unitType = (user as any)?.printHouseProfile?.unitType || 0;

  const getHeaders = async () => {
    if (!materialKey) return;

    setLoading(true);
    const callBack = (res: any) => {
      if (res?.success && res?.data?.tableHeaders) {
        setHeaders(res.data.tableHeaders);
      }
      setLoading(false);
    };

    await getMaterialTableHeadersApi(callApi, callBack, materialKey);
  };

  useEffect(() => {
    getHeaders();
  }, [materialKey]);

  const getUnitForField = (fieldKey: string): string | null => {
    const header = headers.find((h) => h.key === fieldKey);
    if (!header?.unit) return null;

    const convertedUnit =
      unitType === UNIT_TYPE.IMPERIAL
        ? convertTitleUnits(header.unit)
        : header.unit;

    return convertedUnit;
  };

  const getDisplayUnit = (fieldKey: string): string => {
    const unit = getUnitForField(fieldKey);
    return unit ? ` (${unit})` : "";
  };

  return {
    headers,
    loading,
    getUnitForField,
    getDisplayUnit,
    unitType,
  };
};
