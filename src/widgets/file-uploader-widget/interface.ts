export interface IUploadingFileGroup {
  orderItemId: string;
  boardMissionId: string;
  boardMissionProductType?: string;
  filePath: string;
  graphicsFilePath?: string;
  title: string;
  filesInfo: IUploadingFile[];
  extension?: any;
}

export interface IUploadingFile {
  fileName: string;
  fileStatus: EUploadingFileStatus;
  fileType?: FileTypeENUM;
}

export enum EUploadingFileStatus {
  UPLOADING = 1,
  Uploaded,
  ERROR,
  DONE,
}

export enum FileTypeENUM {
  Printing = 0,
  Graphics,
}
