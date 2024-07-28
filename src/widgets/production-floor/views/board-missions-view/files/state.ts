import {atom} from "recoil";

export interface IBoardMissionsFile {
    id: string;
    name: string;
    screenShotURL: string;
    uploadDate: string;
    filePath: string;
}
export const boardMissionsFilesState = atom<IBoardMissionsFile[]>({
    default: [],
    key: 'boardMissionsFilesState'
});
