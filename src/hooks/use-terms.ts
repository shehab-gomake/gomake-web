import { useState } from "react";

const useTermsFlag = () => {
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to handle closing the modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return {
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
