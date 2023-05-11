import { useCustomer } from "@/hooks";

const useHeader = () => {
  const { user } = useCustomer();

  return { user };
};

export { useHeader };
