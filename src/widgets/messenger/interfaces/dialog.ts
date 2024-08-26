export interface IChatDialog {
    created_at: Date;
    is_join_required?: boolean
    last_message: string;
    last_message_date_sent: number;
    last_message_id: string;
    last_message_user_id: number;
    name: string;
    occupants_ids: number[];
    photo?: string;
    type: number
    unread_messages_count: number;
    updated_at: string;
    user_id: number;
    xmpp_room_jid?: string;
    _id: string;
    data: {
        chatroom_type: '1' | '2',
        class_name: "ChatRoomData"
    }
}