import {clearStorage} from "@/services/storage-data";

const useDashboardLogout = () => {
    const logout = () => {
     clearStorage();
     window.location.reload();
    }
    return {
        logout
    }
}

export {useDashboardLogout}