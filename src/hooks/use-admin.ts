import { clearStorage } from "@/services/storage-data";
import { adminState, permissionsState } from "@/store";
import { useCallback } from "react";
import { useRecoilState } from "recoil";
import { useGomakeAxios } from "./use-gomake-axios";
import { useGomakeRouter } from "./use-gomake-router";
import { userTypeState } from "@/store/user-type";

const useAdmin = () => {
  const { callApi } = useGomakeAxios();
  const [admin, setAdmin] = useRecoilState<any>(adminState);
  const [userType, setUserType] = useRecoilState<any>(userTypeState);

  const [permissions, setPermissions] = useRecoilState<any>(permissionsState);
  const { navigate } = useGomakeRouter();
  const logOut = useCallback(() => {
    setAdmin({});
    clearStorage();
    navigate("/");
  }, []);

  const validate = useCallback(async () => {
    const validate: any = await callApi("GET", "/v1/admin/validate");
    if (validate?.success) {
      setAdmin(validate?.data?.data?.admin);
      setUserType({ type: "admin" });
      //   setPermissions(validate?.data?.data?.permissions); will  be implemented later
      return true;
    }
    clearStorage();
    navigate("/admin/login");
    return false;
  }, []);

  const checkPermission = useCallback(
    (permission: string) => {
      let canAccess = false;
      const index = permissions.findIndex(
        (item: any) => item.route === permission
      );
      if (index !== -1) {
        canAccess = true;
      }
      return canAccess;
    },
    [permissions]
  );

  const getPermission = useCallback(
    (permission: string) => {
      const _permissions = permissions.filter(
        (item: any) => item.route === permission
      );
      let op = "";
      if (
        _permissions[0]?.op === "read" ||
        _permissions[1]?.op === "read" ||
        _permissions[2]?.op === "read"
      ) {
        op = "read";
      }
      if (
        _permissions[0]?.op === "write" ||
        _permissions[1]?.op === "write" ||
        _permissions[2]?.op === "write"
      ) {
        op = "write";
      }
      if (
        _permissions[0]?.op === "admin" ||
        _permissions[1]?.op === "admin" ||
        _permissions[2]?.op === "admin"
      ) {
        op = "admin";
      }
      return { op };
    },
    [permissions]
  );

  return {
    admin,
    setAdmin,
    logOut,
    checkPermission,
    getPermission,
    setPermissions,
    validate,
  };
};

export { useAdmin };
