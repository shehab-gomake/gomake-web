import { useGomakeAuth } from "@/hooks/use-gomake-auth";
import { Permissions } from "@/components/CheckPermission/enum";

const useHasPermission = (permission: Permissions) => {
  const { isAuth } = useGomakeAuth(permission);

  return isAuth;
};

export { useHasPermission };