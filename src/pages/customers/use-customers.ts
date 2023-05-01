import { useCallback, useEffect, useMemo, useState } from "react";
import { useGomakeAxios } from "@/hooks/use-gomake-axios";
import { useTranslation } from "react-i18next";


const useCustomers = ({ item }: any) => {
    const { callApi } = useGomakeAxios();
    const { t } = useTranslation();
    const [allCustomers, setAllCustomers] = useState([]);
    const tabelHeaders = useMemo(
      () => [
        t("Customer Code"),
        t("Name"),
        t("Customer Type"),
        t("Agent"),
        t("Email"),
        t("Fax"),
        t("Mobile"),
        t("Phone1"),
        t("Phone1"),
        t("Status"),
        t("#"),
      ],
      []
    );
    return {
        tabelHeaders,
        allCustomers,
      };
    };
    export { useCustomers };
    