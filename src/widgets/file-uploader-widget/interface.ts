export interface IUploadingFileGroup {
  orderItemId: string;
  boardMissionId: string;
  filePath: string;
  title: string;
  filesInfo: IUploadingFile[];
  extension?: any;
}

export interface IUploadingFile {
  fileName: string;
  fileStatus: EUploadingFileStatus;
  fileCategory?: "Graphics" | "Printing";
}

export enum EUploadingFileStatus {
  UPLOADING = 1,
  Uploaded,
  ERROR,
  DONE,
}
