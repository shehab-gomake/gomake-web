import { FileTypeENUM } from "@/widgets/file-uploader-widget/interface";
import { atom } from "recoil";

export interface IBoardMissionsFile {
  id: string;
  name: string;
  screenShotURL: string;
  uploadDate: string;
  filePath: string;
  fileType?: FileTypeENUM;
}
export const boardMissionsFilesState = atom<IBoardMissionsFile[]>({
  default: [],
  key: "boardMissionsFilesState",
});
