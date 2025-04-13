import { getAndSetCustomerById } from "@/services/api-service/customers/customers-api";
import { useCallback, useState } from "react";
import { useGomakeAxios } from "./use-gomake-axios";

interface Customer {
  contacts?: any[];
  addresses?: any[];
  users?: any[];
  [key: string]: any;
}

interface UseCustomerEditReturn {
  showCustomerModal: boolean;
  customerForEdit: Customer | null;
  setCustomerForEdit: any;
  getCustomerForEdit: (clientId: string) => Promise<void>;
  closeModal: () => void;
}

export const useCustomerEdit = (): UseCustomerEditReturn => {
  const { callApi } = useGomakeAxios();
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [customerForEdit, setCustomerForEdit] = useState<Customer | null>(null);

  const getCustomerForEdit = useCallback(async (clientId: string) => {
    const callBack = (res: any) => {
      if (res.success) {
        const customer = res.data;

        ["contacts", "addresses", "users"].forEach((field) => {
          if (customer[field] && Array.isArray(customer[field])) {
            customer[field].forEach((item: any, index: number) => {
              item.index = index;
            });
          }
        });

        setCustomerForEdit(customer);
        setShowCustomerModal(true);
      }
    };

    await getAndSetCustomerById(callApi, callBack, { customerId: clientId });
  }, []);

  const closeModal = () => {
    setShowCustomerModal(false);
    setCustomerForEdit(null);
  };

  return {
    showCustomerModal,
    customerForEdit,
    setCustomerForEdit,
    getCustomerForEdit,
    closeModal,
  };
};
