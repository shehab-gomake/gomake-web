
export interface IChatMessage {
    attachments: IChatMessageAttachment[];
    chat_dialog_id: string;
    created_at: Date;
    date_sent: number;
    delivered_ids: number[];
    message: string;
    notification_type: string;
    origin_sender_name: string;
    qb_message_action: string;
    qb_original_messages?: string;
    read: number;
    read_ids: number[]
    recipient_id: number;
    sender_id: number;
    updated_at: Date;
    _id: string;
    fileUrl?: string;
    file_approval_Request_id?: string;
    quote_approval_Request_id?: string;
    userMetaData: IUserMetaData
}

export interface IChatMessageAttachment {
    id: string;
    type: string;
    url?: string;
}

export interface ISendChatMessage {
    type: 'chat' | 'groupchat';
    body: string,
    sender_id: number,
    extension: Record<string, any>,
    markable: 1 | 0
}

export interface IUserMetaData {
    profileImage: string;
    avatarInitials: string;
    fullName: string;
    userId:string;
}