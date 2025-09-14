export type ConversationMessage = {
  id: string;
  from: "me" | "them";
  text: string;
  at: string; // human readable time
};

