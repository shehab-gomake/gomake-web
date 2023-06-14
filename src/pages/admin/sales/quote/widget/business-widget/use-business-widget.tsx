import { useGomakeAxios } from "@/hooks";
import { getAndSetAllCustomers } from "@/services/hooks";
import { useCallback } from "react";

const useBusinessWidget = () => {
  const { callApi } = useGomakeAxios();

  return {};
};

export { useBusinessWidget };
