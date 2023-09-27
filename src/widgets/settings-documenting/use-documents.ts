import {useRecoilState} from "recoil";
import { documentsArrayState } from "./state/documents-state";

const useDocument = () => {

    const [documents, setDocuments] = useRecoilState<[]>(documentsArrayState);
    const getAllDocuments = () => {

    }

    return {
    }
}

export {useDocument}