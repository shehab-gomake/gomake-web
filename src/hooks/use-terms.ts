import { useState } from "react";
import { useGomakeAxios } from "@/hooks";

const useTermsFlag = () => {
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { callApi } = useGomakeAxios();

  // Function to fetch the terms flag from the API
  // const fetchTermsFlag = (isTermsAcceptedFlag) => {
  //   try {
  //     setLoading(true);
  //     setIsTermsAccepted(isTermsAcceptedFlag);
  //     return isTermsAccepted;
  //   } catch (err) {
  //     setError(err);
  //     return false;
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // Function to handle closing the modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return {
    // fetchTermsFlag,
    isTermsAccepted,
    isModalOpen,
    setIsModalOpen,
    handleCloseModal,
    setIsTermsAccepted,
    loading,
    error,
  };
};

export default useTermsFlag;
