export interface IUploadingFileGroup {
    orderItemId: string;
    path: string;
    title: string;
    filesInfo: IUploadingFile[];
}
export interface IUploadingFile {
    fileName: string;
    fileStatus: EUploadingFileStatus;
}


export enum EUploadingFileStatus {
    UPLOADING = 1,
    Uploaded,
    ERROR,
    DONE,
}