import {ICallAndSetData} from "@/services/api-service/interface";
import {getSetApiData} from "@/services/api-service/get-set-api-data";
import {EHttpMethod} from "@/services/api-service/enums";

const ADD_NEW_MATERIAL_SUPPLIER = '/v1/materials/addSupplier';
const GET_MATERIAL_SUPPLIERS = '/v1/materials/GetPrintHouseMaterialCategorySuppliers';
const SET_DEFAULT_SUPPLIER_URL = '/v1/materials/update-print-house-materials-category-default-supplier';

interface IAddSupplierData {
    materialTypeKey: string
    categoryKey: string;
    supplierId: string;
}

interface IGetMaterialSuppliersData {
    key: string;
    categoryName: string;
}

interface ISetDefaultSupplierData {
    materialTypeKey: string;
    categoryKey: string;
    supplierId: string;
}
const addMaterialSupplier: ICallAndSetData = async (callApi, setState, data: IAddSupplierData) => {
    return await getSetApiData(callApi,
        EHttpMethod.POST,
        ADD_NEW_MATERIAL_SUPPLIER,
        setState,
        data
    );
}

const getMaterialSuppliersApi: ICallAndSetData = async (callApi, setState, data: IGetMaterialSuppliersData) => {
    return await getSetApiData(callApi,
        EHttpMethod.GET,
        GET_MATERIAL_SUPPLIERS,
        setState,
        data
    );
}
const setDefaultSupplierApi: ICallAndSetData = async (callApi, setState, data: ISetDefaultSupplierData) => {
    return await getSetApiData(callApi,
        EHttpMethod.POST,
        SET_DEFAULT_SUPPLIER_URL,
        setState,
        data
    );
}

export {
    addMaterialSupplier,
    getMaterialSuppliersApi,
    setDefaultSupplierApi
}