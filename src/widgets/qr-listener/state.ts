import {atom} from "recoil";
export interface IQrCodeData {
    boardMissionId: string;
    stationId: string;
    stationName: string;
    statusId: string;
    statusName: string;
    productType: string;
    qrCodeAction: number;
    quantity: number;
}
export const qrCodeState = atom<string>({
    key: 'qrCodeListenerState',
    default: ''
});

export const qrDataState = atom<IQrCodeData>({
    key: 'qrCodeDataState',
    default: {} as IQrCodeData
})
