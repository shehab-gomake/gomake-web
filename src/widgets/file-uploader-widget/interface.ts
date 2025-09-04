export interface IUploadingFileGroup {
  orderItemId: string;
  boardMissionId: string;
  filePath: string;
  productType: string;
  graphicsFilePath?: string;
  title: string;
  filesInfo: IUploadingFile[];
  extension?: any;
  isComplexProduct?: boolean;
  hotFolderName?: string;
  onFileDeleted?: (fileName: string, fileType: FileTypeENUM) => void;
}

export interface IUploadingFile {
  fileName: string;
  fileStatus: EUploadingFileStatus;
  fileType?: FileTypeENUM;
  uploadId?:any;
  filePath?: string;
  orderItemId?: string;
  productType?: string;
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
