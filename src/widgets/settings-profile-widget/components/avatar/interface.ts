export interface ICameraMenuProps {
    onUploadImage: (file: any) => void;
    changeInitials?: boolean;
    onChangeInitials?: (label: string, color: string) => void;
}

export interface IProfileAvatar {
    title: string;
    src?: string;
    onUploadImage: (file) => void
    changeInitials?: boolean;
    onChangeInitials?: (label: string, color: string) => void;
    initials?: string;
    label?: string;
    bgColor?: string;
}