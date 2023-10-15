import { useCustomer, useGomakeRouter } from "@/hooks";

const useMoreCircle = () => {
  const { user } = useCustomer();
  const { navigate } = useGomakeRouter();

  return {
    user,
    navigate,
  };
};

export { useMoreCircle };
