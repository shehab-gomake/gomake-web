import { useRecoilValue, useSetRecoilState } from "recoil";
import { boardsMissionsState } from "@/widgets/production-floor/state/boards";
import {
  searchJobsApi,
} from "@/services/api-service/board-missions/board-missions-table";
import { useGomakeAxios, useSnackBar } from "@/hooks";
import {
  filteredMissionsStateBySearch,
  missionsListState,
  productionFloorTextSearchState,
  searchLoadingState,
} from "../state/text-search";
import {useState} from "react";
import {getAndSetCustomerById} from "@/services/api-service/customers/customers-api";

const useProductionFloorTable = () => {
  const { callApi } = useGomakeAxios();
  const { alertFaultGetData } = useSnackBar();
  const data = useRecoilValue(boardsMissionsState);
  const search = useRecoilValue(productionFloorTextSearchState);
  const setFilteredMissionsBySearch = useSetRecoilState(
    filteredMissionsStateBySearch
  );
  const setMissionsList = useSetRecoilState(missionsListState);
  const setLoading = useSetRecoilState(searchLoadingState);
  const [openCustomerModal, setOpenCustomerModal] = useState(false);
  const [customer, setCustomer] = useState([]);
  const getAllBoardMissionsFromSearch = async () => {
    setLoading(true);
    const callBack = (res) => {
      setLoading(false);
      if (res?.success) {

        setMissionsList(res.data);
      } else {
        setMissionsList([]);
        alertFaultGetData();
      }
    };
    await searchJobsApi(
      callApi,
      callBack,
      {
        search,
      },
      false
    );
  };
 
  const getCustomerForEdit = async (id) => {
    const callBack = (res) => {
      if (res.success) {
        let customer = res.data;
        if (customer.contacts && customer.contacts.length > 0) {
          let index = 0;
          customer.contacts.forEach((x) => {
            x.index = index;
            index++;
          });
        }
        if (customer.addresses && customer.addresses.length > 0) {
          let index = 0;
          customer.addresses.forEach((x) => {
            x.index = index;
            index++;
          });
        }
        if (customer.users && customer.users.length > 0) {
          let index = 0;
          customer.users.forEach((x) => {
            x.index = index;
            index++;
          });
        }
        setCustomer(customer);
        setOpenCustomerModal(true);
      }
    };
    await getAndSetCustomerById(callApi, callBack, { customerId: id });
  };
  return {
    data,
    search,
    setFilteredMissionsBySearch,
    getAllBoardMissionsFromSearch,
    setMissionsList,
    getCustomerForEdit,
    openCustomerModal,
    setOpenCustomerModal,
    customer,
    setCustomer
  };
};

export { useProductionFloorTable };
