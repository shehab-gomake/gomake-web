import { clearStorage } from "@/services/storage-data";
import { userState } from "@/store";
import { permissionsState } from "@/store/permissions";
import { useCallback, useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { useGomakeAxios } from "./use-gomake-axios";
import { useGomakeRouter } from "./use-gomake-router";

const useCustomer = () => {
  const { callApi } = useGomakeAxios();
  const [user, setUser] = useRecoilState<any>(userState);
  const [adminsAutoComplate, setAdminsAutoComplate] = useState([]);
  const [permissions, setPermissions] = useRecoilState<any>(permissionsState);
  const { navigate } = useGomakeRouter();
  const logOut = useCallback(() => {
    setUser({});
    clearStorage();
    navigate("/");
  }, []);

  const validate = useCallback(async () => {
    const validate: any = await callApi("GET", "/v1/auth/validate");
    if (validate?.success) {
      setUser(validate?.data?.data?.customer);

      //   setPermissions(validate?.data?.data?.permissions); will  be implemented later
      return true;
    }
    clearStorage();
    navigate("/login");
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
    adminsAutoComplate,
    user,
    setUser,
    logOut,
    checkPermission,
    getPermission,
    setPermissions,
    validate,
  };
};

export { useCustomer };
