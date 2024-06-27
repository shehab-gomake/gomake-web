import {atom} from "recoil";
import {IUploadingFileGroup} from "@/widgets/file-uploader-widget/interface";

export const fileUploaderConnectionIdState = atom<string>({
    default: '',
    key: 'fileUploaderConnectionIdState'
});

export const uploadingFilesState = atom<IUploadingFileGroup[]>({
    default: [],
    key: 'uploadingFilesState'
});

export const openFileUploaderList = atom<boolean>({
    default: false,
    key: 'openFileUploaderList'
});

export const pinFileUploaderState = atom<boolean>({
    default: false,
    key: 'pinFileUploaderState'
})