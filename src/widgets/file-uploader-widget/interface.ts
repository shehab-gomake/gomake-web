export interface IUploadingFileGroup {
    orderItemId: string;
    path: string;
    title: string;
    filesInfo: IUploadingFile[];
}
export interface IUploadingFile {
    name: string;
    status: EUploadingFileStatus;
}


export enum EUploadingFileStatus {
    UPLOADING,
    DONE,
    ERROR
}