import { useCallback, useEffect, useMemo, useState } from "react";
import { useGomakeAxios } from "@/hooks/use-gomake-axios";
import { useTranslation } from "react-i18next";
import { getAndSetAllCustomers } from "@/services/hooks/get-set-customers";

const useSuppliers = (clientType , pageNumber) => {
  const { callApi } = useGomakeAxios();
  const { t } = useTranslation();
  const [allSuppliers, setAllSuppliers] = useState([]);

  const tabelHeaders = useMemo(
    () => [
      t("suppliers.supplierCode"),
      t("suppliers.name"),
      t("suppliers.email"),
      t("suppliers.phone"),
      t("suppliers.status"),
      t("suppliers.hashtag"),
    ],
    []
  );

  // select status options
  const statuses = useMemo(
    () => [
      { label: t("suppliers.active"), value: "true" },
      { label: t("suppliers.inactive"), value: "false" },
    ],
    []
  );

  const [isActive, setStatus] = useState([]);
  const [valStatus, setValStatus] = useState([]);
  const onChangeStatus = useCallback(async (e: any, value: any) => {
    setStatus(value?.value);
    setValStatus(value?.label);
  }, []);

  const handleClean = useCallback(async () => {
    setStatus(null);
    setValStatus(null);

  }, []);

  /////////////////////////  table data //////////////////////////////

  const getAllCustomers = useCallback(async () => {
    const data = await getAndSetAllCustomers(callApi, setAllSuppliers, {
      clientType,
      pageNumber,
      pageSize: 10,
      isActive,
    });

    return data;
  }, [pageNumber , isActive]);

  useEffect(() => {
    getAllCustomers();
  }, [pageNumber , isActive]);

  return {
    tabelHeaders,
    allSuppliers,
    statuses,
    onChangeStatus,
    setAllSuppliers,
    handleClean,
    valStatus,
  };
};
export { useSuppliers };
